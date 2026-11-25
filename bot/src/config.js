/**
 * Zentrale Konfiguration des Bots.
 *
 * Umgebungsvariablen werden hier gelesen und geprüft, statt an vielen Stellen
 * direkt auf process.env zuzugreifen. Das macht die Anwendung leichter zu
 * testen und hält spätere Erweiterungen übersichtlich.
 */

export function loadConfig(env = process.env) {
  const token = env.DISCORD_TOKEN?.trim();

  if (!token) {
    throw new Error('DISCORD_TOKEN fehlt. Bitte als Heroku Config Var setzen.');
  }

  return {
    token,
    commandPrefix: env.COMMAND_PREFIX?.trim() || '?',
  };
}
