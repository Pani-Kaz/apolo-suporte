import { client } from "../../index";
import prisma from "../../common/config/prisma";
import { EmbedBuilder, TextChannel } from "discord.js";

export const getAndSendUser = async (userId: string, thread_id: string) => {
    const thread = await prisma.complaint.findFirst({
        where: {
            channel_id: thread_id
        }
    });
    if(!thread) return 'Thread nao encontrada';

    const user = await client.users.fetch(userId).catch(() => {
        return null;
    });

    if (!user) {
        return 'Usuário não encontrado, solicite para o usuário outro ID'
    } else {
        const channel = client.channels.cache.get(thread?.channel_id) as TextChannel;
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('Informações sobre o denunciado')
                .setThumbnail(user.displayAvatarURL())
                .setDescription(`Nome: ${user.username}\nID: ${user.id}`)
                .setTimestamp()
            ]
        });

        return `Informações sobre o denunciado: ${user.username} ID: ${user.id}`
    }
}