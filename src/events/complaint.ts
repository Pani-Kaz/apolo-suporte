import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Interaction, ModalBuilder, TextChannel, TextInputBuilder, TextInputStyle, ThreadChannel } from "discord.js";
import { addMessageToThread } from "../handlers/handleComplaint";
import prisma from "../common/config/prisma";
import { closeReport } from "../utils/complaint/closeReport";

export const name = "interactionCreate";
export const once = false;
export async function execute(interaction: Interaction) {
    if(interaction.isModalSubmit()) {
        if(interaction.customId === "complaint_close") {
            const thread = interaction.channel as ThreadChannel;
            await interaction.deferUpdate();
            const reason = interaction.fields.getTextInputValue('complaint_reason');
            await closeReport(thread.id, reason, false, interaction.user.id);
            await thread.send(interaction.user.toString() + ' Denuncia fechada com sucesso! O canal será deletado em 5 minutos.');
            await thread.setLocked(true);
        };
        return;
    };
    if(!interaction.isButton()) return;
    const { customId } = interaction;
    if(customId === "complaint_button") {
        await interaction.deferReply({flags: "Ephemeral"});

        const channel = interaction.channel as TextChannel;
        const thread = await channel.threads.create({
            name: `denuncia-${interaction.user.id}`,
            autoArchiveDuration: 60,
            type: ChannelType.PrivateThread,
        });
        await thread.setLocked(true);
        const welcome = await thread.send({
            content: `${interaction.user.toString()}`,
            embeds: [
                new EmbedBuilder()
                .setDescription('# Sistema de Denúncias\n\nOlá, seja bem-vindo(a) ao sistema de denúncia.')
                .setColor('Yellow')
                .setFooter({text: 'Aguarde um instante e já será atendido.'})
                .setThumbnail('https://apolobot.com/images/apolo_pc_transparente.png')
                .setTimestamp()
            ]
        });
        await welcome.pin();
        await interaction.editReply({
            content: 'Sua thread foi criada! Vá para ela para prosseguir com sua denúncia.',
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Ir para a thread')
                    .setURL(thread.url)
                )
            ]
        })
        const assistant = await addMessageToThread(thread.id, interaction.user.id, '[SISTEMA] Thread iniciada');
        if(assistant?.message) {
            await thread.send({
                content: `${interaction.user.toString()} ${assistant.message}`
            });
            await thread.setLocked(false);
            await prisma.complaint.create({
                data: {
                    user_id: interaction.user.id,
                    channel_id: thread.id,
                    type: 'opened',
                    assistant_data: assistant?.threadId
                }
            });
        };
    } else if(customId === "complaint_close") {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        if(member?.roles.cache.has(process.env.SUPPORT_ID || "")) {
            await interaction.showModal(
                new ModalBuilder()
                .setTitle('Fechar denúncia')
                .setCustomId('complaint_close')
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('complaint_reason')
                        .setLabel('Motivo')
                        .setStyle(TextInputStyle.Paragraph)
                    )
                )
            )
        } else interaction.reply({
            content: ' ❌ | Apenas membros da equipe podem fechar denúncias',
            flags: "Ephemeral"
        })
    }
}
