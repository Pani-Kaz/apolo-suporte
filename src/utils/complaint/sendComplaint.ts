import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";

import prisma from "../../common/config/prisma";
import { client } from "../../common/config/client";

export const sendComplaint = async (thread_id: string) => {
    const thread = await prisma.complaint.findFirst({
        where: {
            channel_id: thread_id
        }
    });
    if(!thread) return 'Thread nao encontrada';
    await prisma.complaint.update({
        where: {
            id: thread.id
        },
        data: {
            type: 'resolved'
        }
    })
    const channel = client.channels.cache.get(thread_id) as TextChannel;
    const user = await client.users.fetch(thread.user_id).catch(() => {
        return null;
    })
    channel.send({
        content: `<@&${process.env.SUPPORT_ID}>`,
        embeds: [
            new EmbedBuilder()
            .setTitle('Nova denuncia')
            .setDescription(`Denunciante: <@${thread.user_id}> (ID: ${thread.user_id})`)
            .setColor('Yellow')
            .setTimestamp()
            .setThumbnail(user?.displayAvatarURL() || 'https://apolobot.com/images/apolo_pc_transparente.png')
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('complaint_close')
                .setLabel('Fechar denuncia')
                .setStyle(ButtonStyle.Danger)
            )
        ]
    
    });
    return 'Denuncia enviada com sucesso!'
}