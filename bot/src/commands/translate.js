import { isLanguage, languageName, lookup } from '../dictionary.js';

const MAX_RESULTS = 5;
const MAX_MESSAGE_LENGTH = 1900;

function valueOrFallback(value, fallback = '—') {
  return value?.trim() || fallback;
}

function translationValue(entry, targetLanguage) {
  if (targetLanguage === 'tlh') {
    return entry.entry_name;
  }
  if (targetLanguage === 'de') {
    return valueOrFallback(entry.definition_de, entry.definition);
  }
  return valueOrFallback(entry.definition);
}

function formatEntry(entry, targetLanguage) {
  const partOfSpeech = entry.part_of_speech ? ` *(${entry.part_of_speech})*` : '';
  return [
    `**${entry.entry_name}**${partOfSpeech}`,
    `${targetLanguage.toUpperCase()}: ${translationValue(entry, targetLanguage)}`,
  ].join('\n');
}

function formatResults(term, sourceLanguage, targetLanguage, results) {
  if (results.length === 0) {
    return `Keine Treffer für \`${term}\` in ${languageName(sourceLanguage)}.`;
  }

  const header = `**${results.length} Treffer für \`${term}\`**`;
  const body = results.map((entry) => formatEntry(entry, targetLanguage)).join('\n\n');
  const message = `${header}\n\n${body}`;
  return message.length <= MAX_MESSAGE_LENGTH
    ? message
    : `${message.slice(0, MAX_MESSAGE_LENGTH - 1)}…`;
}

/**
 * ?tlh <word> — short Klingon lookup, kept compatible with the old bot.
 */
export const tlhCommand = {
  name: 'tlh',
  async execute(message, args) {
    const term = args.join(' ').trim();
    if (!term) {
      await message.reply('Verwendung: `x?tlh <Wort>`');
      return;
    }

    await message.reply(formatResults(term, 'tlh', 'de', lookup(term, 'tlh', MAX_RESULTS)));
  },
};

/**
 * !mugh <source> <search term> <target> — basic explicit translation lookup.
 *
 * The target language selects the displayed definition. The command does not
 * infer morphology or perform fuzzy matching.
 */
export const mughCommand = {
  name: 'mugh',
  async execute(message, args) {
    if (args.length < 3) {
      await message.reply('Verwendung: `x!mugh <tlh|de|en> <Suchbegriff> <de|en|tlh>`');
      return;
    }

    const sourceLanguage = args[0].toLowerCase();
    const targetLanguage = args.at(-1).toLowerCase();
    const term = args.slice(1, -1).join(' ').trim();

    if (!isLanguage(sourceLanguage) || !isLanguage(targetLanguage) || !term) {
      await message.reply('Sprachen müssen `tlh`, `de` oder `en` sein.');
      return;
    }

    await message.reply(formatResults(term, sourceLanguage, targetLanguage, lookup(term, sourceLanguage, MAX_RESULTS)));
  },
};
