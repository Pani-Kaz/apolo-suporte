import { Client } from "discord.js";
import { config } from "./bot";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildMembers"],
});

export async function initClient() {
  if (!client.isReady()) {
    await client.login(config.TOKEN);
  }
}

export { client };
