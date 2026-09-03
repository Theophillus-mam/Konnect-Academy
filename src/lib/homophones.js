/**
 * Words that sound the same.
 *
 * Speech-to-text resolves a homophone by guessing from context and frequency,
 * not from the audio, because the audio is identical. On a single word there
 * is no context, so the transcript is close to a coin toss between the members
 * of a group. That makes a textual match worthless as evidence that the right
 * word was said, and this list is what lets the checker say so instead of
 * claiming a pass it cannot justify.
 *
 * Grouped by language. Not exhaustive, and does not need to be: it covers the
 * pairs learners actually meet, and anything missing simply falls back to the
 * ordinary comparison.
 */

const GROUPS = {
  en: [
    ["there", "their", "theyre"],
    ["to", "too", "two"],
    ["your", "youre"],
    ["its", "its"],
    ["hear", "here"],
    ["see", "sea"],
    ["be", "bee"],
    ["by", "buy", "bye"],
    ["for", "four", "fore"],
    ["know", "no"],
    ["knew", "new"],
    ["write", "right", "rite"],
    ["one", "won"],
    ["son", "sun"],
    ["flour", "flower"],
    ["weather", "whether"],
    ["which", "witch"],
    ["where", "wear", "ware"],
    ["piece", "peace"],
    ["week", "weak"],
    ["meat", "meet"],
    ["made", "maid"],
    ["mail", "male"],
    ["plain", "plane"],
    ["sale", "sail"],
    ["some", "sum"],
    ["tail", "tale"],
    ["wait", "weight"],
    ["break", "brake"],
    ["cell", "sell"],
    ["cent", "scent", "sent"],
    ["course", "coarse"],
    ["allowed", "aloud"],
    ["board", "bored"],
    ["hour", "our"],
    ["principal", "principle"],
    ["stationary", "stationery"],
    ["threw", "through"],
    ["whole", "hole"],
    ["road", "rode", "rowed"],
    ["steal", "steel"],
    ["waist", "waste"],
    ["wood", "would"],
    ["pair", "pear", "pare"],
    ["bare", "bear"],
    ["fair", "fare"],
    ["hair", "hare"],
    ["heal", "heel"],
    ["higher", "hire"],
    ["loan", "lone"],
    ["nose", "knows"],
    ["poor", "pour", "pore"],
    ["rain", "reign", "rein"],
    ["raise", "rays"],
    ["scene", "seen"],
    ["seam", "seem"],
    ["sight", "site", "cite"],
    ["sole", "soul"],
    ["stair", "stare"],
    ["toe", "tow"],
    ["vain", "vein", "vane"],
    ["waive", "wave"],
    ["aisle", "isle"],
    ["berry", "bury"],
    ["cereal", "serial"],
    ["dear", "deer"],
    ["die", "dye"],
    ["find", "fined"],
    ["grate", "great"],
    ["groan", "grown"],
    ["guessed", "guest"],
    ["heard", "herd"],
    ["hi", "high"],
    ["knight", "night"],
    ["mind", "mined"],
    ["missed", "mist"],
    ["morning", "mourning"],
    ["none", "nun"],
    ["passed", "past"],
    ["patience", "patients"],
    ["peak", "peek", "pique"],
    ["profit", "prophet"],
    ["role", "roll"],
    ["stake", "steak"],
    ["team", "teem"],
    ["throne", "thrown"],
    ["tide", "tied"],
    ["war", "wore"],
    ["weve", "weave"],
    ["wine", "whine"],
    ["accept", "except"],
  ],
  fr: [
    ["a", "as", "a"],
    ["et", "est"],
    ["ou", "ou"],
    ["son", "sont"],
    ["sur", "sur"],
    ["ces", "ses", "cest", "sest", "sait", "sais"],
    ["mer", "mere", "maire"],
    ["ver", "vert", "verre", "vers", "vair"],
    ["cent", "sans", "sang", "sent"],
    ["vin", "vingt", "vint", "vain"],
    ["peu", "peut", "peux"],
    ["fin", "faim"],
    ["foi", "foie", "fois"],
    ["mon", "mont"],
    ["cou", "coup", "cout"],
    ["temps", "tant", "tend"],
    ["haut", "eau", "au", "oh"],
    ["pere", "paire", "pair"],
    ["mais", "mes", "met", "mets", "mai"],
    ["la", "la", "las"],
    ["ni", "nid"],
    ["cor", "corps"],
    ["cane", "canne"],
    ["chair", "chere", "chaire"],
    ["compte", "comte", "conte"],
    ["dans", "dent"],
    ["encre", "ancre"],
    ["champ", "chant"],
    ["pain", "pin"],
    ["port", "porc"],
    ["reine", "renne"],
    ["saut", "sot", "seau"],
    ["tache", "tache"],
    ["voie", "voix"],
  ],
  pt: [
    ["ha", "a", "a"],
    ["concerto", "conserto"],
    ["sessao", "secao", "cessao"],
    ["cela", "sela"],
    ["censo", "senso"],
    ["cerrar", "serrar"],
    ["conselho", "concelho"],
    ["espiar", "expiar"],
    ["paco", "passo"],
    ["taxa", "tacha"],
    ["acento", "assento"],
    ["cozer", "coser"],
    ["ruca", "russa"],
    ["cede", "sede"],
    ["cesta", "sesta"],
    ["cinto", "sinto"],
    ["caçar", "cassar"],
    ["cheque", "xeque"],
    ["conjuntura", "conjectura"],
    ["descriminar", "discriminar"],
    ["emergir", "imergir"],
    ["esperto", "experto"],
    ["incipiente", "insipiente"],
    ["mandato", "mandado"],
    ["tachar", "taxar"],
  ],
};

/** normalise() from pronunciation.js, duplicated to keep this file standalone. */
const flatten = (t) =>
  (t || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();

/** word -> Set of every word it is confusable with, built once per language. */
const INDEX = {};

function indexFor(languageCode) {
  const lang = (languageCode || "en").slice(0, 2);
  if (INDEX[lang]) return INDEX[lang];

  const map = new Map();
  for (const group of GROUPS[lang] || []) {
    const members = [...new Set(group.map(flatten))].filter(Boolean);
    for (const w of members) {
      const others = members.filter((m) => m !== w);
      if (!others.length) continue;
      map.set(w, new Set([...(map.get(w) || []), ...others]));
    }
  }
  INDEX[lang] = map;
  return map;
}

/**
 * The words that sound like this one, excluding itself. Empty when the word is
 * not in a group, which is the common case.
 */
export function homophonesOf(word, languageCode) {
  const key = flatten(word);
  if (!key || key.includes(" ")) return [];
  return [...(indexFor(languageCode).get(key) || [])];
}

/** True when two different spellings sound the same in this language. */
export function areHomophones(a, b, languageCode) {
  const x = flatten(a), y = flatten(b);
  if (!x || !y || x === y) return false;
  return homophonesOf(x, languageCode).includes(y);
}
