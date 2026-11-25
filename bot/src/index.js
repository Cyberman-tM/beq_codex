import { Client, Events, GatewayIntentBits } from 'discord.js';
import { loadConfig } from './config.js';
import { handleMessage } from './commands/index.js';

/**
 * Einstiegspunkt von beq.
 *
 * Dieses Modul verdrahtet nur Discord und die getrennten Funktionsmodule.
 * Neue Funktionen sollten möglichst als eigene Module ergänzt und hier nur
 * über einen kleinen Handler angeschlossen werden.
 */

let config;

try {
  config = loadConfig();
} catch (error) {
  console.error(`[beq] Konfiguration ungültig: ${error.message}`);
  process.exitCode = 1;
}

if (config) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`[beq] Eingeloggt als ${readyClient.user.tag}`);
    console.log(`[beq] Bereit auf ${readyClient.guilds.cache.size} Server(n).`);
  });

  client.on(Events.MessageCreate, async (message) => {
    try {
      await handleMessage(message, config.commandPrefix);
    } catch (error) {
      console.error('[beq] Fehler bei der Nachrichtenverarbeitung:', error);
    }
  });

  client.on('error', (error) => {
    console.error('[beq] Discord-Clientfehler:', error);
  });

  process.on('unhandledRejection', (error) => {
    console.error('[beq] Nicht behandelte Promise-Ablehnung:', error);
  });

  // Heroku beendet Worker mit SIGTERM. Discord sauber zu trennen verhindert
  // unnötige Reconnects und macht Neustarts für spätere Erweiterungen sicherer.
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      console.log(`[beq] ${signal} empfangen, Bot wird beendet.`);
      client.destroy();
    });
  }

  client.login(config.token).catch((error) => {
    console.error('[beq] Anmeldung bei Discord fehlgeschlagen:', error);
    process.exitCode = 1;
  });
}
