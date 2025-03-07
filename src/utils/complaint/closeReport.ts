
import { config } from "../../common/config/bot";
import { client } from "../../common/config/client";
import prisma from "../../common/config/prisma";
import { EmbedBuilder, TextChannel } from "discord.js";

export const closeReport = async (thread_id: string, reason: string, isReject: boolean = true, staffId?: string) => {
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
            type: 'rejected'
        }
    });

    const user = await client.users.fetch(thread.user_id).catch(() => {
        return null;
    })
    const channel = client.channels.cache.get(thread.channel_id) as TextChannel;
    if(user) {
        const embed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({
            iconURL: 'https://apolobot.com/images/apolo_pc_transparente.png',
            name: 'Suite do Apolo'
        })
        .setTitle(isReject ? 'Denuncia rejeitada' : 'Denuncia resolvida')
        .addFields(
            {
                name: `🆔 Id da denuncia`,
                value: `${thread.id}`,
                inline: true,
            },
            {
                name: `<:BVM_acertou2:1120062554941702254> Denunciante`,
                value: `<@${thread.user_id}>`,
                inline: true,
            },
            {
                name: `<:error:1096580230870732920> Fechado por`,
                value: `<@${staffId || client.user?.id}>`,
                inline: true,
            },
            {
                name: `<:funcionrio_apolo:1129509892785447096> Aberto em`,
                value: `<t:${channel.createdTimestamp}:F>`,
                inline: true,
            },
            {
                name: `<:mensagem_apolo:1129505065934278796> Motivo`,
                value: `${reason}`,
                inline: false,
            },
        );
        (client.channels.cache.get(config.LOGS_REPORT || "") as TextChannel)?.send({
            embeds: [
                embed
            ]
        })
        user.send({
            embeds: [
                embed
            ]
        }).catch(err => {})
    }
    if(channel) channel.send({
        embeds: [
            new EmbedBuilder()
            .setTitle(isReject ? 'Denuncia rejeitada' : 'Denuncia resolvida')
            .setDescription(`Denunciante: <@${thread.user_id}> (ID: ${thread.user_id})\nMotivo: ${reason}`)
            .setColor('Yellow')
            .setTimestamp()
            .setThumbnail(user?.displayAvatarURL() || 'https://apolobot.com/images/apolo_pc_transparente.png')
        ]
    }).catch(() => {});
    setTimeout(() => {

    }, 60_000 * 5)

   return `thread encerrada`

}
