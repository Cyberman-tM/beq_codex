/**
 * Read-only access to the generated qawHaq SQLite database.
 *
 * The database is generated outside the bot by GitHub Actions. This module
 * deliberately contains only exact and explicit wildcard lookup; fuzzy search
 * and Klingon morphology belong in later, separately testable features.
 */

import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const databasePath = fileURLToPath(new URL('../data/qawHaq.db', import.meta.url));
const database = new DatabaseSync(databasePath, { readOnly: true });

const languages = {
  tlh: {
    name: 'Klingonisch',
    searchColumns: ['entry_name', 'search_tags'],
    definitionColumn: 'entry_name',
  },
  en: {
    name: 'Englisch',
    searchColumns: ['definition', 'search_tags'],
    definitionColumn: 'definition',
  },
  de: {
    name: 'Deutsch',
    searchColumns: ['definition_de', 'search_tags_de'],
    definitionColumn: 'definition_de',
  },
};

function getLanguage(code) {
  return languages[code.toLowerCase()];
}

function searchPattern(term) {
  // The old command syntax uses * as an explicit wildcard. Without a wildcard
  // the lookup remains exact, so ordinary searches do not become fuzzy.
  return term.includes('*') || term.includes('?') ? term : term;
}

function lookupWithPattern(pattern, exactTerm, sourceLanguage, limit) {
  const language = getLanguage(sourceLanguage);
  if (!language || !pattern) {
    return [];
  }

  const predicates = language.searchColumns.map((column) => `${column} GLOB ?`);
  const sql = `
    SELECT _id, entry_name, part_of_speech, definition, definition_de,
           notes, notes_de
    FROM mem
    WHERE ${predicates.join(' OR ')}
    ORDER BY CASE WHEN entry_name = ? THEN 0 ELSE 1 END, _id
    LIMIT ?
  `;
  const parameters = [
    ...language.searchColumns.map(() => pattern),
    exactTerm,
    limit,
  ];

  return database.prepare(sql).all(...parameters);
}

export function lookup(term, sourceLanguage = 'tlh', limit = 5) {
  if (!term) {
    return [];
  }
  return lookupWithPattern(searchPattern(term), term, sourceLanguage, limit);
}

export function lookupFragment(term, sourceLanguage = 'tlh', limit = 5) {
  if (!term) {
    return [];
  }
  return lookupWithPattern(`*${term}*`, term, sourceLanguage, limit);
}

export function isLanguage(code) {
  return Boolean(getLanguage(code));
}

export function languageName(code) {
  return getLanguage(code)?.name ?? code;
}

export function countEntries() {
  return database.prepare('SELECT COUNT(*) AS count FROM mem').get().count;
}

