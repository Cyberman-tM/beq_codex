/**
 * Central personality text loader.
 *
 * Text belongs in bot/data/personality.json, not in command modules. This
 * keeps wording changes separate from code changes and gives future humans or
 * AIs one obvious place to extend beq's voice.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const personalityPath = fileURLToPath(new URL('../data/personality.json', import.meta.url));
const personality = JSON.parse(readFileSync(personalityPath, 'utf8'));

export function getLines(section) {
  const value = personality[section];
  return Array.isArray(value) ? value.filter((line) => typeof line === 'string' && line.length > 0) : [];
}

export function randomLine(section) {
  const lines = getLines(section);
  return lines.length === 0 ? '' : lines[Math.floor(Math.random() * lines.length)];
}

export function randomReaction(name) {
  const reactions = personality.reactions?.[name];
  if (!Array.isArray(reactions) || reactions.length === 0) {
    return '';
  }
  return reactions[Math.floor(Math.random() * reactions.length)];
}
