import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import { ticketsEmbed } from "../../common/templates/ticketsEmbed";

export const data = new SlashCommandBuilder()
    .setName("tickets")
    .setDescription("Send the tickets message");

export async function execute(interaction: CommandInteraction) {
    if(!interaction.member?.permissions.toString().includes('Administrator')) return await interaction.reply({content: 'Você não tem permissão para executar esse comando!', ephemeral: true});
    await interaction.deferReply({ flags: "Ephemeral" });

    const channel = interaction.channel as TextChannel;
    if (!channel) {
        await interaction.followUp({ content: "Não consegui encontrar o canal!", flags: "Ephemeral" });
        return;
    }

    const menu = new StringSelectMenuBuilder()
        .setCustomId("tickets_menu")
        .setPlaceholder("Selecione um tipo de ticket")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Bugs")
                .setValue("bugs")
                .setEmoji("🚫"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Denúncias")
                .setValue("denuncias")
                .setEmoji("🚨"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Suporte")
                .setValue("suporte")
                .setEmoji("🔧"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Compras")
                .setValue("compras")
                .setEmoji("🛒")
        );

    const rowMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    await channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Central de Suporte')
                .setThumbnail('https://apolobot.com/images/apolo_pc_transparente.png')
                .setAuthor({
                    iconURL: 'https://apolobot.com/images/apolo_pc_transparente.png',
                    name: 'Suite do Apolo',
                })
                .setDescription(ticketsEmbed)
        ],
        components: [rowMenu]
    });

    await interaction.deleteReply();
};
