import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BOT_NAME } from '../config.js';
import { randomLine } from '../personality.js';
import { sendStandalone } from './respond.js';

const packagePath = fileURLToPath(new URL('../../../package.json', import.meta.url));
const sourcePath = fileURLToPath(new URL('../../data/SOURCE.txt', import.meta.url));
const packageInfo = JSON.parse(readFileSync(packagePath, 'utf8'));

function readSourceInfo() {
  try {
    return readFileSync(sourcePath, 'utf8').trim();
  } catch {
    return 'Datenbankquelle: keine Metadaten gefunden';
  }
}

/**
 * x!yIngu' — identify the bot and its current dictionary build.
 */
export const identityCommand = {
  name: "yingu'",
  async execute(message) {
    const entryCount = message.client.dictionaryEntryCount ?? 'unbekannt';
    const content = [
      `**devbeq — ${BOT_NAME}**`,
      `Version: ${packageInfo.version}`,
      'Ein Klingonisch-Nachschlagebot für Discord.',
      `Datenbankeinträge: ${entryCount}`,
      '```text',
      readSourceInfo(),
      '```',
      randomLine('identity'),
    ].join('\n');

    await sendStandalone(message, content);
  },
};
