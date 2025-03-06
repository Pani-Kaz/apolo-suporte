import { OpenAI } from 'openai';
import prisma from '../common/config/prisma';
import { Client, Interaction, TextChannel, Message } from "discord.js";
import { getAndSendUser } from '../utils/complaint/getAndSendUser';
import { sendComplaint } from '../utils/complaint/sendComplaint';
import { closeReport } from '../utils/complaint/closeReport';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const threadQueues: Record<string, { content: string; author: string; }[]> = {};
const threadMapping: Record<string, string> = {};
const processingThreads = new Set<string>();

export async function addMessageToThread(threadId: string, userId: string, message: string): Promise<{ threadId: string, message: string } | undefined> {
    if (!threadQueues[threadId]) {
        threadQueues[threadId] = [];
    }

    threadQueues[threadId].push({ content: message, author: userId });

    if (processingThreads.has(threadId)) {
        return;
    }

    return await handleComplaintThread(threadId);
}

export async function handleComplaintThread(threadId: string): Promise<{ threadId: string, message: string } | undefined> {
    if (!threadQueues[threadId] || threadQueues[threadId].length === 0) {
        return;
    }

    processingThreads.add(threadId);

    try {
        if (!threadMapping[threadId]) {
            const newThread = await openai.beta.threads.create();
            threadMapping[threadId] = newThread.id;
        }

        const openAiThreadId = threadMapping[threadId];

        while (threadQueues[threadId].length > 0) {
            const userMessage = threadQueues[threadId].shift();
            if (!userMessage) continue;

            await openai.beta.threads.messages.create(openAiThreadId, {
                role: "user",
                content: userMessage.content,
            });

            let run = await openai.beta.threads.runs.createAndPoll(openAiThreadId, {
                assistant_id: process.env.OPENAI_ASSISTANT_ID || "",
                stream: false,
            });

            while (run.status === 'requires_action') {
                const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls || [];

                const toolOutputs = await Promise.all(toolCalls.map(async (toolCall) => {
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    
                    console.log(`Executando função: ${functionName} com args:`, functionArgs);

                    let functionResponse;
                    if (functionName === 'handle_user_id') {
                        functionResponse = await getAndSendUser(functionArgs.user_id, threadId);
                    } else if(functionName === 'conclude_report') {
                        functionResponse = await sendComplaint(threadId);
                    } else if(functionName === 'close_report') {
                        functionResponse = await closeReport(threadId, functionArgs.motivo_fechamento);
                    } else {
                        functionResponse = { error: "Função desconhecida" };
                    }

                    return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(functionResponse),
                    };
                }));

                run = await openai.beta.threads.runs.submitToolOutputsAndPoll(openAiThreadId, run.id, {
                    tool_outputs: toolOutputs,
                });
            }

            if (run.status === 'completed') {
                const messages = await openai.beta.threads.messages.list(run.thread_id);
                return {
                    threadId: run.thread_id,
                    message: `${(messages.data[0].content[0] as any)?.text.value}`
                };
            }
        }
    } catch (error) {
        console.error('Erro ao processar denúncia:', error);
    } finally {
        processingThreads.delete(threadId);
    }
}