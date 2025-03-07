import { Client } from "discord.js";
import { config } from "./bot";

let client: Client;

export async function initClient() {
  if (!client) {
    client = new Client({
        intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildMembers"],
      });
    await client.login(config.TOKEN);
  }
}

export { client };
