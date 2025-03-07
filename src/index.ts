import { client } from "./common/config/client";
import { loadEvents } from "./handlers/eventHandler";
import { deployCommands } from "./handlers/deployCommands";
import app from "./handlers/express";


client.once("ready", () => {
  client.guilds.cache.forEach(async (guild) => {
    await deployCommands({ guildId: guild.id });
  });
});
loadEvents(client);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

process.on('uncaughtException', e => {
  console.log(e)
})

process.on('unhandledRejection', e => {
  console.log(e)
})