import { Client, Interaction } from "discord.js";
import { commands } from "../commands";

export const name = "interactionCreate";
export const once = false;
export async function execute(interaction: Interaction) {
    if (!interaction.isCommand()) {
        return;
      }
      const { commandName } = interaction;
      if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
      }
}
