import { pingCommand } from './ping.js';

// Neue Textbefehle werden hier registriert. Jedes Kommando bleibt in einer
// eigenen Datei, damit index.js nicht zur großen Sammeldatei anwächst.
const commands = new Map([[pingCommand.name, pingCommand]]);

export async function handleMessage(message, prefix) {
  if (message.author.bot || !message.content.startsWith(prefix)) {
    return;
  }

  const input = message.content.slice(prefix.length).trim();
  const [name] = input.split(/\s+/, 1);
  const command = commands.get(name.toLowerCase());

  if (!command) {
    return;
  }

  await command.execute(message);
}
