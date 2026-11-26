/**
 * Human-readable labels for boQwI' part_of_speech metadata.
 *
 * The first tag is the broad word class (v, n, sen, ...). The remaining
 * comma-separated tags describe grammar, categories, or metadata. Unknown
 * implementation tags are intentionally omitted from user-facing output.
 */

const labels = {
  de: {
    n: 'Nomen',
    v: 'Verb',
    sen: 'Satz',
    adv: 'Adverb',
    conj: 'Bindewort',
    ques: 'Fragewort',
    excl: 'Ausruf',
    reg: 'Regionalausdruck',
    phr: 'Redewendung',
    idiom: 'Idiom',
    prov: 'Sprichwort',
    toast: 'Trinkspruch',
    lyr: 'Liedtext',
    rp: 'Ersatzsprichwort',
    sp: 'Geheimsprichwort',
    mv: "mu'qaD veS",
    nt: "nentay",
    Ql: "QI'lop",
    rej: 'Zurückweisung',
  },
  en: {
    n: 'Noun',
    v: 'Verb',
    sen: 'Sentence',
    adv: 'Adverb',
    conj: 'Conjunction',
    ques: 'Question word',
    excl: 'Exclamation',
    reg: 'Regional expression',
    phr: 'Phrase',
    idiom: 'Idiom',
    prov: 'Proverb',
    toast: 'Toast',
    lyr: 'Lyrics',
    rp: 'Replacement proverb',
    sp: 'Secret proverb',
    mv: "mu'qaD veS",
    nt: 'nentay',
    Ql: "QI'lop",
    rej: 'Rejection',
  },
};

const details = {
  de: {
    ambi: 'ambitransitiv',
    i: 'intransitiv',
    is: 'Zustandsverb',
    i_c: 'intransitiv (bestätigt)',
    t: 'transitiv',
    t_c: 'transitiv (bestätigt)',
    pref: 'Präfix',
    suff: 'Suffix',
    name: 'Eigenname',
    num: 'Zahlwort',
    pro: 'Pronomen',
    body: 'Körperteil',
    being: 'sprachfähiges Wesen',
    place: 'Ortsname',
    inhpl: 'inhärent pluralisch',
    inhps: 'Singularform eines inhärent pluralischen Nomens',
    plural: 'bereits pluralisch',
    anim: 'Tier',
    archaic: 'veraltet/zeremoniell',
    deriv: 'abgeleitet',
    reg: 'regional',
    food: 'Essen/Trinken',
    inv: 'Schimpfwort',
    slang: 'Slang',
    weap: 'Waffe/Waffenbezug',
    alt: 'alternative Schreibweise',
    fic: 'fiktional',
    hyp: 'hypothetisch',
    extcan: 'erweiterter Kanon',
    klcp1: 'KLCP1 Stufe 1',
    terran: 'terranischer Begriff',
  },
  en: {
    ambi: 'ambitransitive',
    i: 'intransitive',
    is: 'stative',
    i_c: 'intransitive (confirmed)',
    t: 'transitive',
    t_c: 'transitive (confirmed)',
    pref: 'prefix',
    suff: 'suffix',
    name: 'proper name',
    num: 'number',
    pro: 'pronoun',
    body: 'body part',
    being: 'language-capable being',
    place: 'place name',
    inhpl: 'inherently plural',
    inhps: 'singular of an inherently plural noun',
    plural: 'already plural',
    anim: 'animal',
    archaic: 'archaic/ceremonial',
    deriv: 'derived',
    reg: 'regional',
    food: 'food/drink',
    inv: 'invective',
    slang: 'slang',
    weap: 'weapon-related',
    alt: 'alternative spelling',
    fic: 'fictional',
    hyp: 'hypothesised',
    extcan: 'extended canon',
    klcp1: 'KLCP1 level 1',
    terran: 'Terran term',
  },
};

export function describePartOfSpeech(value, language = 'de') {
  if (!value) {
    return { label: language === 'en' ? 'Entry' : 'Eintrag', details: [] };
  }

  const dictionary = details[language] ?? details.de;
  const [first, ...commaTags] = value.split(',');
  const [base, ...colonTags] = first.split(':');
  const tags = [...colonTags, ...commaTags];
  const label = (labels[language] ?? labels.de)[base] ?? base;
  const readableDetails = [];

  for (const tag of tags) {
    if (/^\d+$/.test(tag)) {
      readableDetails.push(language === 'en' ? `sense ${tag}` : `Bedeutung ${tag}`);
      continue;
    }
    if (dictionary[tag]) {
      readableDetails.push(dictionary[tag]);
    }
  }

  return { label, details: readableDetails };
}
