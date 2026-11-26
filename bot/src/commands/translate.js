import { isLanguage, languageName, lookup, lookupFragment } from '../dictionary.js';
import { describePartOfSpeech } from '../partOfSpeech.js';
import { sendStandalone } from './respond.js';

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
  const outputLanguage = targetLanguage === 'en' ? 'en' : 'de';
  const partOfSpeech = describePartOfSpeech(entry.part_of_speech, outputLanguage);
  const title = `**${partOfSpeech.label}:** ${entry.entry_name}`;
  const detailLine = partOfSpeech.details.length > 0
    ? ` · *${partOfSpeech.details.join(' · ')}*`
    : '';
  return [
    `${title}${detailLine}`,
    `${targetLanguage.toUpperCase()}: ${translationValue(entry, targetLanguage)}`,
  ].filter(Boolean).join('\n');
}

function formatResults(term, sourceLanguage, targetLanguage, results, fragment = false) {
  if (results.length === 0) {
    return `Keine Treffer für \`${term}\` in ${languageName(sourceLanguage)}.`;
  }

  const header = fragment
    ? `**Keine exakte Übereinstimmung. Fragmenttreffer für \`${term}\` (${results.length})**`
    : `**${results.length} Treffer für \`${term}\`**`;
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
      await sendStandalone(message, 'Verwendung: `x?tlh <Wort>`');
      return;
    }

    let results = lookup(term, 'tlh', MAX_RESULTS);
    let fragment = false;
    if (results.length === 0) {
      results = lookupFragment(term, 'tlh', MAX_RESULTS);
      fragment = results.length > 0;
    }

    // Do not use message.reply here: Discord resolves a reply by message ID,
    // so editing the original command would also change the old reply preview.
    await sendStandalone(message, formatResults(term, 'tlh', 'de', results, fragment));
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
      await sendStandalone(message, 'Verwendung: `x!mugh <tlh|de|en> <Suchbegriff> <de|en|tlh>`');
      return;
    }

    const sourceLanguage = args[0].toLowerCase();
    const targetLanguage = args.at(-1).toLowerCase();
    const term = args.slice(1, -1).join(' ').trim();

    if (!isLanguage(sourceLanguage) || !isLanguage(targetLanguage) || !term) {
      await sendStandalone(message, 'Sprachen müssen `tlh`, `de` oder `en` sein.');
      return;
    }

    let results = lookup(term, sourceLanguage, MAX_RESULTS);
    let fragment = false;
    if (results.length === 0) {
      results = lookupFragment(term, sourceLanguage, MAX_RESULTS);
      fragment = results.length > 0;
    }

    await sendStandalone(message, formatResults(term, sourceLanguage, targetLanguage, results, fragment));
  },
};
