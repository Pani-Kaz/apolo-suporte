import { client } from "./common/config/client";
import { loadEvents } from "./handlers/eventHandler";
import { deployCommands } from "./handlers/deployCommands";
import { TextChannel } from "discord.js";

client.once("ready", async () => {
  const ch = await client.channels.fetch("1424969254595203165");
  if(ch) {
   await (ch as TextChannel).messages.fetch();
  }
  client.guilds.cache.forEach(async (guild) => {
    await deployCommands({ guildId: guild.id });
  });
});
loadEvents(client);

process.on('uncaughtException', e => {
  console.log(e)
})

process.on('unhandledRejection', e => {
  console.log(e)
})