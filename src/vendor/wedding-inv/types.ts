export type AttendanceStatus = 'attending' | 'regret' | 'attending_partner' | 'declined';

export interface Wish {
  id: string;
  name: string;
  message: string;
  relationship: string;
  attendance: AttendanceStatus;
  /** Party size from the RSVP form — carried to the RSVP record, not shown or stored on the wish. */
  guestCount?: number;
  createdAt: string;
  avatarColor: string;
}

export interface PhotoLikeDetail {
  guestName: string;
  likedAt: string;
  source?: string;
}

export type PhotoOrientation = 'portrait' | 'landscape';

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: 'Kyoto Series' | 'Editorial Studio' | 'Golden Hour' | 'Garden Vows' | 'Candid Smiles' | string;
  caption: string;
  location: string;
  likes: number;
  orientation?: PhotoOrientation;
  isLikedByMe?: boolean;
  likedBy?: PhotoLikeDetail[];
}

export interface WeddingEvent {
  id: string;
  type: 'ceremony' | 'reception';
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  hall?: string;
  address: string;
  city: string;
  mapsUrl: string;
  mapEmbedUrl: string;
  wazeUrl?: string;
  transitNotes?: string;
  parkingInfo?: string;
  dressCode: string;
  iconName: string;
}

export interface CouplePersonInfo {
  fullName: string;
  honorificName?: string;
  nickname: string;
  role: string;
  parents: string;
  fatherPassed?: boolean;
  fatherName: string;
  motherName: string;
  instagram: string;
  instagramUrl: string;
  bio: string;
  photoUrl: string;
}

export interface HeroSlide {
  src: string;
  tag: string;
  location: string;
  orientation?: PhotoOrientation;
}

export interface CoupleInfo {
  groom: CouplePersonInfo;
  bride: CouplePersonInfo;
  monogram: string;
  coverBackgroundImage: string;
  eventDate: string; // ISO string e.g. 2026-12-19T18:00:00+07:00
  formattedDate: string;
  time: string;
  venueSummary: string;
  mapsUrl: string;
  hashtag: string;
  verse: string;
  heroSlides: HeroSlide[];
}

export interface RSVPRecord {
  id: string;
  guestName: string;
  /** Omitted while the reservation is still PENDING (created with the link
   *  before the guest has replied). */
  attendance?: AttendanceStatus;
  paxCount: number;
  contact?: string; // phone or email
  wishesMessage?: string;
  notes?: string;
  relationship?: string;
  submittedAt: string;
  source: 'invitation' | 'admin';
  checkedIn?: boolean;
  checkedInAt?: string;
  checkedInPax?: number;
  tableNumber?: string;
  guestCode?: string; // specific invitation code or token (e.g. ?g=...)
  linkKind?: GuestLinkKind; // fixed at link creation
  linkCreatedAt?: string;
  cancelCount?: number;
  updateCount?: number;
  reactivateCount?: number;
  autoCancelledAt?: string;
}

export interface RSVPConfirmationStatus {
  isDone: boolean;
  /** `not_found` = the server answered and has no reservation for this code. */
  status: 'attending' | 'declined' | 'pending' | 'not_found';
  statusLabel: string;
  shortLabel: string;
  badgeVariant: 'done_attending' | 'done_declined' | 'pending';
  record?: RSVPRecord | null;
  paxCount?: number;
  submittedAt?: string;
  guestCode?: string;
  notes?: string;
}

export interface CheckInRecord {
  id: string;
  guestName: string;
  /** Unique invitation identity. Name alone is not unique. */
  guestCode?: string;
  pax: number;
  relationship?: string;
  tableNumber?: string;
  checkedInAt: string;
  checkInSource: 'qr_scan' | 'manual' | 'walk_in' | 'scanner_wedge';
  rsvpId?: string;
  deviceId?: string;
  notes?: string;
}

export interface AdminWeddingConfig {
  couple: CoupleInfo;
  coupleInfo?: CoupleInfo;
  events: WeddingEvent[];
  gallery: GalleryPhoto[];
  fontTheme?: string;
  storyMilestones?: StoryMilestone[];
  cinematicVideo?: CinematicVideoConfig;
  showHolyMatrimony?: boolean;
  galleryAutoArrange?: boolean;
  /** Photo behind the reception kiosk (welcome and scanner stages), tinted so
   *  the kiosk stays readable. Empty/absent means the plain dark background. */
  receptionBackgroundImage?: string;
}

/** One media item on a story milestone — an image or a video, each rendered in
 *  its own orientation. A milestone can have zero, one, or many. */
export interface StoryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  orientation?: PhotoOrientation;
  /** Switched off in the admin. The entry stays in the config — URL and all —
   *  so it can be turned back on without retyping it, but guests never see it. */
  enabled?: boolean;
}

export interface StoryMilestone {
  id: string;
  year: string;
  date: string;
  title: string;
  subtitle: string;
  narrative: string;
  location: string;
  photoUrl: string;
  orientation?: PhotoOrientation;
  videoUrl?: string; // legacy single-video field (media[] takes precedence)
  /** Ordered media list. When present, it is the source of truth; legacy
   *  photoUrl/videoUrl are only used as a fallback for older saved configs. */
  media?: StoryMedia[];
  /** Display/section grouping. Open-ended so the admin can add categories
   *  (e.g. 'holy_matrimony') beyond the built-in ones. */
  category: 'first_meet' | 'journey' | 'proposal' | 'engagement' | 'wedding_day' | 'holy_matrimony' | (string & {});
}

export interface CinematicVideoConfig {
  title: string;
  subtitle: string;
  videoUrl?: string; // YouTube, Vimeo, or direct mp4
  coverImageUrl?: string;
  duration?: string;
  chapters?: { time: string; title: string }[];
  enabled?: boolean; // Can be toggled or disabled
}

/** A plain seating table (admin-side only). No groups/categories. */
export interface Table {
  id: string;
  label: string; // unique display name shown to admins (never to guests)
  capacity: number; // per-table seat count; 'Open Seating' is effectively unlimited
  notes?: string;
  isBackup?: boolean; // flagged auto-overflow destination at the door
}

/** How a guest link was classified at creation (drives the 14-day rules). */
export type GuestLinkKind = 'common' | 'new';

export interface PrinterSettings {
  autoPrintOnScan: boolean;
  printTableSticker: boolean;
  printNameBadge: boolean;
  printerName?: string;
}

