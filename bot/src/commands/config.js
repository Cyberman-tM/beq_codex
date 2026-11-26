import { defaultPreferences, preferenceStore } from '../preferences.js';
import { sendStandalone } from './respond.js';

function preferenceText(preferences) {
  return [
    `Zielsprache: ${preferences.language}`,
    `Kurzformat: ${preferences.short ? 'an' : 'aus'}`,
  ].join('\n');
}

/**
 * x!config — manage per-user defaults. These currently reset on restart.
 */
export const configCommand = {
  name: 'config',
  async execute(message, args) {
    const userId = message.author.id;
    const action = args[0]?.toLowerCase() ?? 'show';

    if (action === 'show' || action === 'anzeigen') {
      await sendStandalone(message, `Deine beq-Einstellungen:\n${preferenceText(await preferenceStore.get(userId))}`);
      return;
    }

    if (action === 'reset' || action === 'zuruecksetzen') {
      await sendStandalone(message, `Einstellungen zurückgesetzt.\n${preferenceText(await preferenceStore.reset(userId))}`);
      return;
    }

    if (action === 'lang' || action === 'language' || action === 'sprache') {
      const language = args[1]?.toLowerCase();
      if (!['de', 'en'].includes(language)) {
        await sendStandalone(message, 'Verwendung: `x!config lang de|en`');
        return;
      }
      const preferences = await preferenceStore.set(userId, { language });
      await sendStandalone(message, `Zielsprache gesetzt.\n${preferenceText(preferences)}`);
      return;
    }

    if (action === 'short' || action === 'kurz') {
      const value = args[1]?.toLowerCase();
      if (!['on', 'off', 'an', 'aus'].includes(value)) {
        await sendStandalone(message, 'Verwendung: `x!config kurz an|aus`');
        return;
      }
      const preferences = await preferenceStore.set(userId, { short: value === 'on' || value === 'an' });
      await sendStandalone(message, `Kurzformat gesetzt.\n${preferenceText(preferences)}`);
      return;
    }

    await sendStandalone(
      message,
      [
        'Verwendung:',
        '`x!config lang de|en`',
        '`x!config kurz an|aus`',
        '`x!config show`',
        '`x!config reset`',
        `Standardwerte: Sprache ${defaultPreferences.language}, Kurzformat aus`,
      ].join('\n'),
    );
  },
};
