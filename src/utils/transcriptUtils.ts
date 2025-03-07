import { TextChannel } from "discord.js";

import { createTranscript } from "discord-html-transcripts";
import { client } from "../common/config/client";
export const generateTranscriptData = async (user_id: string, thread_id: string) => {
        
    let messages: any[] = [];
    let lastId = undefined;

    const thread = await client.channels.fetch(thread_id) as TextChannel;
    while (true) {
        const fetchedMessages: any = await thread.messages.fetch({
            limit: 100,
            before: lastId
        });
        
        if (fetchedMessages.size === 0) break;
        messages = [...fetchedMessages.values(), ...messages];
        lastId = fetchedMessages.last()?.id;
    }
    
    if (messages.length === 0) return;
    else {
        const transcript = await createTranscript(thread, {
            limit: -1,
            filename: `transcript-${thread.id}.html`,
            footerText: `Transcript: ${user_id}`,
            saveImages: true,
            poweredBy: false
        });
    
        return transcript.attachment.toString('base64');
    };
}