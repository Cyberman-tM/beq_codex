/**
 * User preference storage boundary.
 *
 * The bot currently uses memory only. A future persistent implementation can
 * replace this class (or implement the same async methods) without changing
 * command code. User IDs are Discord IDs and therefore strings.
 */

const DEFAULT_PREFERENCES = Object.freeze({
  language: 'de',
  short: false,
});

export class MemoryPreferenceStore {
  constructor() {
    this.values = new Map();
  }

  async get(userId) {
    return { ...DEFAULT_PREFERENCES, ...(this.values.get(userId) ?? {}) };
  }

  async set(userId, updates) {
    const current = await this.get(userId);
    const next = { ...current, ...updates };
    this.values.set(userId, next);
    return next;
  }

  async reset(userId) {
    this.values.delete(userId);
    return this.get(userId);
  }
}

export const preferenceStore = new MemoryPreferenceStore();
export const defaultPreferences = DEFAULT_PREFERENCES;
