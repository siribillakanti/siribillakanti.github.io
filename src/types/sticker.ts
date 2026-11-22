/**
 * Sticker & Visual Customizer Types
 */

export interface StickerAsset {
  id: string;
  name: string;
  /** Data URL (local) or Supabase Storage URL (production) */
  url: string;
  /** Original file type */
  format: 'png' | 'webp' | 'svg';
  /** Thumbnail data URL for library grid */
  thumbnailUrl?: string;
  /** File size in bytes */
  fileSize?: number;
  createdAt: string;
}

export interface PlacedSticker {
  id: string;
  /** Reference to StickerAsset.id */
  assetId: string;
  /** Asset URL — resolved at render time */
  url: string;
  /** Percentage-based position (0-100) */
  xPercent: number;
  yPercent: number;
  /** Scale factor (0.1 to 3.0) */
  scale: number;
  /** Rotation in degrees */
  rotation: number;
  /** Width in pixels at scale=1 (for resize handle) */
  baseWidth: number;
  baseHeight: number;
  /** z-index layer order */
  zIndex: number;
  /** Whether the sticker is locked from editing */
  locked: boolean;
  /** Whether visible on public site */
  visible: boolean;
  /** Animation mode */
  animation: 'none' | 'float' | 'parallax';
  /** Float animation speed */
  floatSpeed: number;
  /** Parallax intensity factor */
  parallaxFactor: number;
  /** Opacity 0-1 */
  opacity: number;
}

export type StickerPageId = 
  | 'homepage'
  | 'about'
  | 'projects'
  | 'credentials'
  | 'achievements'
  | 'certifications'
  | 'contact';

export interface StickerLayout {
  pageId: StickerPageId;
  stickers: PlacedSticker[];
  updatedAt: string;
}

export interface StickerEditorState {
  /** All uploaded sticker assets in library */
  library: StickerAsset[];
  /** Per-page sticker layouts */
  layouts: Record<StickerPageId, PlacedSticker[]>;
  /** Currently selected sticker ID for editing */
  selectedStickerId: string | null;
  /** Undo/redo history (per active page) */
  undoStack: PlacedSticker[][];
  redoStack: PlacedSticker[][];
}

/** Undo/redo action */
export interface StickerHistoryEntry {
  stickers: PlacedSticker[];
  timestamp: number;
}

export const STICKER_PAGES: { id: StickerPageId; label: string }[] = [
  { id: 'homepage', label: 'Homepage' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export const INITIAL_STICKER_STATE: StickerEditorState = {
  library: [],
  layouts: {
    homepage: [],
    about: [],
    projects: [],
    credentials: [],
    achievements: [],
    certifications: [],
    contact: [],
  },
  selectedStickerId: null,
  undoStack: [],
  redoStack: [],
};
