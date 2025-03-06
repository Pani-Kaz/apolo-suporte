

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { complaintEmbedDescription } from "../../common/templates/complaintEmbed";

export const data = new SlashCommandBuilder()
    .setName("repport")
    .setDescription("Send the report message");

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ flags: "Ephemeral" });

    const channel = interaction.channel as TextChannel;
    if (!channel) {
        await interaction.followUp({ content: "Não consegui encontrar o canal!", flags: "Ephemeral" });
        return;
    }
    const button = new ButtonBuilder()
        .setCustomId("complaint_button")
        .setLabel("Realizar denúncia")
        .setEmoji('1129509892785447096')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor('Yellow')
                .setAuthor({
                    name: 'Seus dados não serão exibidos na denúncia',
                })
                .setDescription(complaintEmbedDescription)
        ],
        components: [row]
    });
    await interaction.deleteReply();
};