/**
 * Minimaler Diagnosebefehl.
 *
 * ?ping dient nur dazu, die Verbindung des Bots im Discord-Server schnell zu
 * prüfen. Fachliche Bot-Funktionen gehören in eigene Command-Module.
 */

export const pingCommand = {
  name: 'ping',
  async execute(message) {
    await message.reply('Pong!');
  },
};
