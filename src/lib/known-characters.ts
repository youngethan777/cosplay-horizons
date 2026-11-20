/**
 * Known characters, starter list for the submission form's last-name
 * check. NOT exhaustive: it only covers characters Ethan has seeded or
 * named so far. Add to it as new full names are confirmed; never guess
 * a last name for a character who is not in this list.
 *
 * Each entry is the character's full name as it should appear on the
 * site. `firstName` is derived from the first word of the full name.
 * Single-word characters (e.g. Link, Neptune) are listed with
 * `hasLastName: false` so the form does not warn about them.
 */
export type KnownCharacter = {
  fullName: string;
  hasLastName: boolean;
};

export const KNOWN_CHARACTERS: KnownCharacter[] = [
  // Seeded characters (Cosplay Horizons, 13 looks)
  { fullName: 'Leon Strohl', hasLastName: true },
  { fullName: 'Agate Crosner', hasLastName: true },
  { fullName: 'Akihiko Sanada', hasLastName: true },
  { fullName: 'Ryusui Nanami', hasLastName: true },
  { fullName: 'Naofumi Iwatani', hasLastName: true },
  { fullName: 'Neptune', hasLastName: false },
  { fullName: 'Satoshi Isshiki', hasLastName: true },
  { fullName: 'Ray Cro Glamor', hasLastName: true },
  { fullName: 'Kamen Rider Wizard', hasLastName: false },
  { fullName: 'Link', hasLastName: false },
  { fullName: 'Izaya Orihara', hasLastName: true },
  // Ethan's examples (Nov 18, 2026)
  { fullName: 'Naruto Uzumaki', hasLastName: true },
  { fullName: 'Ichigo Kurosaki', hasLastName: true },
];

export function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? '';
}

/** Find a known character by first name, case-insensitive. */
export function findKnownCharacterByFirstName(
  firstName: string,
): KnownCharacter | undefined {
  const q = firstName.trim().toLowerCase();
  if (!q) return undefined;
  return KNOWN_CHARACTERS.find(
    (c) => firstNameOf(c.fullName).toLowerCase() === q,
  );
}

/**
 * What the form should do with a typed character name.
 * - 'full-name-match': the typed name already is a known full name.
 * - 'suggest': a single first name matching a known character with a
 *   last name. Offer "Did you mean <full name>?"
 * - 'single-word-known': a single word that is a known character with
 *   no last name. No warning needed.
 * - 'unknown-single': a single word with no known match. Gentle note
 *   only, never a guess.
 * - 'none': anything else (e.g. a multi-word name we do not know).
 */
export type LastNameCheck =
  | { kind: 'full-name-match' }
  | { kind: 'suggest'; fullName: string }
  | { kind: 'single-word-known' }
  | { kind: 'unknown-single' }
  | { kind: 'none' };

export function checkCharacterLastName(typed: string): LastNameCheck {
  const name = typed.trim();
  if (!name) return { kind: 'none' };
  const words = name.split(/\s+/);
  const knownFull = KNOWN_CHARACTERS.find(
    (c) => c.fullName.toLowerCase() === name.toLowerCase(),
  );
  if (knownFull) return { kind: 'full-name-match' };
  if (words.length === 1) {
    const known = findKnownCharacterByFirstName(words[0]);
    if (known && known.hasLastName) {
      return { kind: 'suggest', fullName: known.fullName };
    }
    if (known) return { kind: 'single-word-known' };
    return { kind: 'unknown-single' };
  }
  return { kind: 'none' };
}
