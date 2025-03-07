

import { REST, Routes } from "discord.js";
import { config } from "../common/config/bot";
import { commands } from "../commands";


const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.BOT_ID, guildId),
      {
        body: commandsData,
      }
    );
  } catch (error) {
    console.error(error);
  }
}