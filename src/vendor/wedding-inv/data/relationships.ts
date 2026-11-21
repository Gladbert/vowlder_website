/**
 * The fixed relationship vocabulary. Relationships are not free text: every guest
 * is one of these eleven values, which is what the pickers offer, what the compact
 * guest codes encode, and what the dress-code artwork is chosen from.
 */
export const RELATIONSHIP_VALUES = [
  'Groom - Family',
  'Bride - Family',
  'Groom - Family Friend',
  'Bride - Family Friend',
  'Groom - Cinciu',
  'Bride - Cinciu',
  'Groom - Friend',
  'Bride - Friend',
  'Groom - Colleague',
  'Bride - Colleague',
  'Honoured Guest',
] as const;

export type Relationship = (typeof RELATIONSHIP_VALUES)[number];

/** Used when a guest has no relationship recorded. */
export const DEFAULT_RELATIONSHIP: Relationship = 'Honoured Guest';

/**
 * Legacy and free-text values mapped onto the fixed list. Keys are lower-cased
 * with apostrophes stripped; anything unknown falls back to DEFAULT_RELATIONSHIP.
 * The slash forms are the pre-rename canonical values, kept so stored rows,
 * already-sent links and older local registries still normalize.
 */
const RELATIONSHIP_ALIASES: Record<string, Relationship> = {
  'groom/family': 'Groom - Family',
  'bride/family': 'Bride - Family',
  'groom/family friend': 'Groom - Family Friend',
  'bride/family friend': 'Bride - Family Friend',
  'groom/cinciu': 'Groom - Cinciu',
  'bride/cinciu': 'Bride - Cinciu',
  'groom/friend': 'Groom - Friend',
  'bride/friend': 'Bride - Friend',
  'groom/colleague': 'Groom - Colleague',
  'bride/colleague': 'Bride - Colleague',
  family: 'Groom - Family',
  'groom family': 'Groom - Family',
  'grooms family': 'Groom - Family',
  'bride family': 'Bride - Family',
  'bridefamily': 'Bride - Family',
  'brides family': 'Bride - Family',
  'mutual family': 'Groom - Family',
  cinciu: 'Groom - Cinciu',
  'groom cinciu': 'Groom - Cinciu',
  'grooms cinciu': 'Groom - Cinciu',
  'bride cinciu': 'Bride - Cinciu',
  'brides cinciu': 'Bride - Cinciu',
  friend: 'Groom - Friend',
  friends: 'Groom - Friend',
  'groom friend': 'Groom - Friend',
  'grooms friend': 'Groom - Friend',
  'grooms friends': 'Groom - Friend',
  'bride friend': 'Bride - Friend',
  'brides friend': 'Bride - Friend',
  'brides friends': 'Bride - Friend',
  'friends of gladbert & monica': 'Groom - Friend',
  'friends of gladbert and monica': 'Groom - Friend',
  'mutual friend': 'Groom - Friend',
  colleague: 'Groom - Colleague',
  colleagues: 'Groom - Colleague',
  'groom colleague': 'Groom - Colleague',
  'grooms colleague': 'Groom - Colleague',
  'bride colleague': 'Bride - Colleague',
  'brides colleague': 'Bride - Colleague',
  'mutual colleague': 'Groom - Colleague',
  'family friend': 'Groom - Family Friend',
  'groom family friend': 'Groom - Family Friend',
  'grooms family friend': 'Groom - Family Friend',
  'bride family friend': 'Bride - Family Friend',
  'brides family friend': 'Bride - Family Friend',
  'mothers friend': 'Groom - Family Friend',
  'grooms mothers friend': 'Groom - Family Friend',
  honoured: 'Honoured Guest',
  honored: 'Honoured Guest',
  'honoured guest': 'Honoured Guest',
  'honored guest': 'Honoured Guest',
  'vip guest': 'Honoured Guest',
  'vip dignitary': 'Honoured Guest',
  'vendor / media': 'Honoured Guest',
  other: 'Honoured Guest',
  others: 'Honoured Guest',
  'grooms other guest': 'Groom - Friend',
  'grooms others': 'Groom - Friend',
  'bride other guest': 'Bride - Friend',
  'brides other guest': 'Bride - Friend',
  'brides others': 'Bride - Friend',
  'mutual others': 'Groom - Friend',
};

/** Map any stored/typed value onto one of the fixed values. Never throws. */
export function normalizeRelationship(value?: string | null): Relationship {
  const raw = (value || '').trim();
  if (!raw) return DEFAULT_RELATIONSHIP;
  const exact = RELATIONSHIP_VALUES.find((v) => v.toLowerCase() === raw.toLowerCase());
  if (exact) return exact;
  return RELATIONSHIP_ALIASES[raw.toLowerCase().replace(/[’']/g, '')] ?? DEFAULT_RELATIONSHIP;
}

/**
 * True when a bare word ("family", "friend", "cinciu", "colleague") is the whole
 * value: the side is unknowable from it, and the alias table resolves it to the
 * GROOM side. Callers that accept free text (the bulk importer) should warn
 * instead of silently putting a bride-side guest on the groom's side.
 */
export function isAmbiguousRelationship(value?: string | null): boolean {
  const key = (value || '').trim().toLowerCase().replace(/[’']/g, '');
  if (!key) return false;
  if (RELATIONSHIP_VALUES.some((v) => v.toLowerCase() === key)) return false;
  return AMBIGUOUS_BARE_VALUES.has(key);
}

const AMBIGUOUS_BARE_VALUES = new Set([
  'family',
  'family friend',
  'cinciu',
  'friend',
  'friends',
  'colleague',
  'colleagues',
  'other',
  'others',
  'other guest',
  'mutual family',
  'mutual friend',
  'mutual colleague',
  'mutual others',
]);

/** Which dress-code artwork a relationship uses: only Family has its own image. */
export type RelationshipGroup = 'family' | 'friends';

export function relationshipGroup(value?: string | null): RelationshipGroup {
  const rel = normalizeRelationship(value);
  return rel.endsWith(' - Family') || rel.endsWith(' - Cinciu') ? 'family' : 'friends';
}
