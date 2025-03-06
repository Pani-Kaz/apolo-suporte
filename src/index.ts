
import { Client } from "discord.js";
import { config } from "./common/config/bot";
import { commands } from "./commands";
import { deployCommands } from "./handlers/deployCommands";
import { loadEvents } from "./handlers/eventHandler";
import './handlers/express';

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", 'MessageContent', 'GuildMembers'],
});

client.once("ready", () => {
  client.guilds.cache.forEach(async (guild) => {
   await deployCommands({ guildId: guild.id });
  })
});

loadEvents(client);

client.login(config.TOKEN);

export { client, commands };