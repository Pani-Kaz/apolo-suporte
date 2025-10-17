import { Client, MessageReaction, TextChannel } from "discord.js";

export const name = "messageReactionAdd";
export const once = false;
export async function execute(message: MessageReaction, reaction: any, data: any) {
    if(message.message.channelId == '1134587854853509162' || message.message.channelId == '1424969254595203165') {
        if(message.emoji.id == '1306131834698076170') {
            const guild = message.message.guild;
            if(!guild) return;
            const member = await guild.members.fetch(reaction.id);
            member.roles.add('1424967445361463438');
            (guild.channels.cache.get('1255951031406432357') as TextChannel)?.send({
                content: `<@${reaction.id}> recebeu o cargo de <@&1424967445361463438> por reagir a mensagem ${message.message.url}!`,
                allowedMentions: { users: [reaction.id], roles: [] }
            });
        }
    }
}
