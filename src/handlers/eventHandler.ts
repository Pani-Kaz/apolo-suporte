import { Client } from "discord.js";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

export function loadEvents(client: Client) {
    const eventsPath = join(__dirname, "events");

    console.log(`📂 Tentando carregar eventos de: ${eventsPath}`);
    
    if (!existsSync(eventsPath)) {
        console.error(`🚨 O diretório ${eventsPath} não existe ou está inacessível!`);
    } else {
        const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));
        console.log(`🔍 Encontrados ${eventFiles.length} arquivos de eventos:`, eventFiles);
    
    for (const file of eventFiles) {
        const event = require(join(__dirname, "events", file));

        if (!event.name || !event.execute) {
            console.warn(`⚠️ O arquivo ${file} não possui um nome ou função execute.`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
}
