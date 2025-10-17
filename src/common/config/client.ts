import { Client } from "discord.js";
import { config } from "./bot";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent", "GuildMembers", "GuildMessageReactions"],
});

client.login(config.TOKEN);

export { client };
