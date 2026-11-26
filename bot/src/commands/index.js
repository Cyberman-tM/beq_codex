import { pingCommand } from './ping.js';
import { mughCommand, tlhCommand } from './translate.js';
import { identityCommand } from './identity.js';
import { configCommand } from './config.js';

// Neue Textbefehle werden hier registriert. Jedes Kommando bleibt in einer
// eigenen Datei, damit index.js nicht zur großen Sammeldatei anwächst.
const commands = new Map([
  [pingCommand.name, pingCommand],
  [tlhCommand.name, tlhCommand],
  [mughCommand.name, mughCommand],
  [identityCommand.name, identityCommand],
  [configCommand.name, configCommand],
]);

export async function handleMessage(message, prefix) {
  const prefixes = [prefix];
  // Keep the old command families distinct during testing: x?tlh and x!mugh.
  if (prefix.endsWith('?')) {
    prefixes.push(`${prefix.slice(0, -1)}!`);
  }

  const matchingPrefix = prefixes.find((candidate) => message.content.startsWith(candidate));
  if (message.author.bot || !matchingPrefix) {
    return;
  }

  const input = message.content.slice(matchingPrefix.length).trim();
  const parts = input.split(/\s+/).filter(Boolean);
  const name = parts.shift();
  if (!name) {
    return;
  }
  const command = commands.get(name.toLowerCase());

  if (!command) {
    return;
  }

  await command.execute(message, parts);
}
