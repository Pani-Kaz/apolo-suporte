import { ChannelType, Message } from "discord.js";
import { addMessageToThread } from "../handlers/handleComplaint";
import prisma from "../common/config/prisma";

export const name = "messageCreate";
export const once = false;
export async function execute(message: Message) {
    if(message.channel.type !== ChannelType.PrivateThread) return;
    const threadId = message.channel.id;
    const data = await prisma.complaint.findFirst({
        where: {
            channel_id: threadId,
            type: 'opened'
        }
    });
    if(!data) return;
    if(data.user_id !== message.author.id) return;
    if(!message.content) {
        await message?.channel?.setLocked(true);
        await message.channel.sendTyping();
        if(message.attachments.size > 0) {
            await message.channel.send({
                content: `O usuário anexou os seguintes arquivos:`,
                files: message.attachments.map((attachment) => attachment.url),
            })
            const msg = await addMessageToThread(threadId, message.author.id, `[SISTEMA]: O usuário anexou ${message.attachments.size} arquivos`);
            await message.reply({
                content: msg?.message,
            });
            await message?.channel?.setLocked(false);
            await message.delete();
        }
        return
    };
    await message?.channel?.setLocked(true);
    await message.channel.sendTyping();
    const msg = await addMessageToThread(threadId, message.author.id, message.content);
    await message.reply({
        content: msg?.message,
    });
    await message?.channel?.setLocked(false);
}
