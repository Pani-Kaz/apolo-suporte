

import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
    const ping = Date.now();
    await interaction.reply("Pong!");
    const pong = Date.now() - ping;
    await interaction.editReply(`Pong! ${pong}ms`);
};