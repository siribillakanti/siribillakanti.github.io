import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Project, 
  SkillItem, 
  Certification, 
  Achievement, 
  ProfileData, 
  ExperienceItem, 
  SocialLink,
  SiteBranding,
  SectionContentConfig,
  DetailedDecorationsConfig,
  PortfolioDocument
} from '../types/portfolio';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROJECTS, 
  INITIAL_SKILLS, 
  INITIAL_CERTIFICATIONS, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_BRANDING,
  INITIAL_SECTIONS,
  INITIAL_DETAILED_DECORATIONS,
  INITIAL_ABOUT_DETAILS
} from '../data/initialData';
import { saveMediaItem, getMediaItem, deleteMediaItem } from '../utils/imageStorage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StickerEditorState, INITIAL_STICKER_STATE } from '../types/sticker';

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'bordeaux';
}

interface PortfolioContextType {
  isInitialLoading: boolean;
  profile: ProfileData;
  projects: Project[];
  skills: SkillItem[];
  certifications: Certification[];
  achievements: Achievement[];
  branding: SiteBranding;
  sectionsContent: SectionContentConfig;
  detailedDecorations: DetailedDecorationsConfig;
  stickers: StickerEditorState;
  updateStickers: (newStickers: StickerEditorState | ((prev: StickerEditorState) => StickerEditorState)) => void;
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  isResumeOpen: boolean;
  setIsResumeOpen: (open: boolean) => void;
  selectedCert: Certification | null;
  setSelectedCert: (cert: Certification | null) => void;
  
  // CMS Dashboard & Navigation State
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  adminPin: string;
  updateAdminPin: (newPin: string) => boolean;
  
  // Unsaved Changes Tracking
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  isSaving: boolean;
  saveAllChanges: () => Promise<boolean>;
  discardUnsavedChanges: () => void;
  lastSavedTimestamp: string | null;

  // Project CRUD & Ordering
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  moveProjectOrder: (id: string, direction: 'up' | 'down') => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;

  // Profile & Media Mutations
  updateProfile: (profile: ProfileData) => void;
  uploadProfilePhoto: (dataUrl: string) => Promise<void>;
  removeProfilePhoto: () => Promise<void>;

  // Branding & Logo
  updateBranding: (b: SiteBranding) => void;
  uploadCustomLogo: (dataUrl: string) => Promise<void>;
  removeCustomLogo: () => Promise<void>;

  // Sections Content
  updateSectionContent: (sec: SectionContentConfig) => void;

  // Detailed Decorations Arrangement
  updateDetailedDecorations: (dec: DetailedDecorationsConfig) => void;

  // Skills Mutations
  addSkill: (s: SkillItem) => void;
  updateSkill: (index: number, s: SkillItem) => void;
  deleteSkill: (name: string) => void;

  // Experience Mutations
  addExperience: (exp: ExperienceItem) => void;
  updateExperience: (exp: ExperienceItem) => void;
  deleteExperience: (id: string) => void;

  // Certifications Mutations
  addCertification: (c: Certification) => void;
  updateCertification: (c: Certification) => void;
  deleteCertification: (id: string) => void;

  // Achievements Mutations
  addAchievement: (a: Achievement) => void;
  updateAchievement: (a: Achievement) => void;
  deleteAchievement: (id: string) => void;

  // Social Links Mutations
  addSocialLink: (link: SocialLink) => void;
  updateSocialLink: (link: SocialLink) => void;
  deleteSocialLink: (id: string) => void;

  // Data Export, Import & Reset
  exportPortfolioData: () => string;
  importPortfolioData: (jsonStr: string) => boolean;
  resetToDefaults: () => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'bordeaux') => void;
  dismissToast: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Clean persistent keys with fallback migration from previous keys
const STORAGE_KEYS = {
  PROFILE: 'siri_portfolio_profile_v3',
  PROJECTS: 'siri_portfolio_projects_v3',
  SKILLS: 'siri_portfolio_skills_v3',
  CERTS: 'siri_portfolio_certs_v3',
  ACHIEVEMENTS: 'siri_portfolio_achievements_v3',
  BRANDING: 'siri_portfolio_branding_v3',
  SECTIONS: 'siri_portfolio_sections_v3',
  DECORATIONS: 'siri_portfolio_decorations_v3',
  AUTH: 'siri_portfolio_admin_auth_v3',
  ADMIN_PIN: 'siri_portfolio_admin_pin_v3',
  LAST_SAVED: 'siri_portfolio_last_saved_v3',
};

// Legacy keys for seamless migration
const LEGACY_KEYS = {
  PROFILE: 'siri_universe_profile_v2',
  PROJECTS: 'siri_universe_projects_v2',
  SKILLS: 'siri_universe_skills_v2',
  CERTS: 'siri_universe_certs_v2',
  ACHIEVEMENTS: 'siri_universe_achievements_v2',
  AUTH: 'siri_universe_admin_auth_v2',
  ADMIN_PIN: 'siri_universe_admin_pin_v2',
  LAST_SAVED: 'siri_universe_last_saved_v2',
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem(LEGACY_KEYS.PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_PROFILE, ...parsed };
      } catch (e) {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  // 2. Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS) || localStorage.getItem(LEGACY_KEYS.PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  // 3. Skills State
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS) || localStorage.getItem(LEGACY_KEYS.SKILLS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SKILLS;
      }
    }
    return INITIAL_SKILLS;
  });

  // 4. Certifications State
  const [certifications, setCertifications] = useState<Certification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTS) || localStorage.getItem(LEGACY_KEYS.CERTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CERTIFICATIONS;
      }
    }
    return INITIAL_CERTIFICATIONS;
  });

  // 5. Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || localStorage.getItem(LEGACY_KEYS.ACHIEVEMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ACHIEVEMENTS;
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // 6. Branding & Identity State
  const [branding, setBranding] = useState<SiteBranding>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRANDING);
    if (saved) {
      try {
        return { ...INITIAL_BRANDING, ...JSON.parse(saved) };
      } catch (e) {
        return INITIAL_BRANDING;
      }
    }
    return INITIAL_BRANDING;
  });

  // 7. Section Content Config State
  const [sectionsContent, setSectionsContent] = useState<SectionContentConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (saved) {
      try {
        return { ...INITIAL_SECTIONS, ...JSON.parse(saved) };
      } catch (e) {
        return INITIAL_SECTIONS;
      }
    }
    return INITIAL_SECTIONS;
  });

  // 8. Detailed Decorations Arrangement State
  const [detailedDecorations, setDetailedDecorations] = useState<DetailedDecorationsConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DECORATIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          wordle: { ...INITIAL_DETAILED_DECORATIONS.wordle, ...(parsed.wordle || {}) },
          callaLily: { ...INITIAL_DETAILED_DECORATIONS.callaLily, ...(parsed.callaLily || {}) },
          tigerLily1: { ...INITIAL_DETAILED_DECORATIONS.tigerLily1, ...(parsed.tigerLily1 || {}) },
          tigerLily2: { ...INITIAL_DETAILED_DECORATIONS.tigerLily2, ...(parsed.tigerLily2 || {}) },
          orchid: { ...INITIAL_DETAILED_DECORATIONS.orchid, ...(parsed.orchid || {}) },
          pacman: { ...INITIAL_DETAILED_DECORATIONS.pacman, ...(parsed.pacman || {}) },
          vintageCamera: { ...INITIAL_DETAILED_DECORATIONS.vintageCamera, ...(parsed.vintageCamera || {}) },
          instantCamera: { ...INITIAL_DETAILED_DECORATIONS.instantCamera, ...(parsed.instantCamera || {}) },
          microchip: { ...INITIAL_DETAILED_DECORATIONS.microchip, ...(parsed.microchip || {}) },
        };
      } catch (e) {
        return INITIAL_DETAILED_DECORATIONS;
      }
    }
    return INITIAL_DETAILED_DECORATIONS;
  });

  // 9. Visual Stickers State
  const [stickers, setStickers] = useState<StickerEditorState>(() => {
    try {
      const saved = localStorage.getItem('siri_portfolio_stickers_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          library: Array.isArray(parsed.library) ? parsed.library : [],
          layouts: {
            homepage: Array.isArray(parsed.layouts?.homepage) ? parsed.layouts.homepage : [],
            about: Array.isArray(parsed.layouts?.about) ? parsed.layouts.about : [],
            projects: Array.isArray(parsed.layouts?.projects) ? parsed.layouts.projects : [],
            credentials: Array.isArray(parsed.layouts?.credentials) ? parsed.layouts.credentials : [],
            achievements: Array.isArray(parsed.layouts?.achievements) ? parsed.layouts.achievements : [],
            certifications: Array.isArray(parsed.layouts?.certifications) ? parsed.layouts.certifications : [],
            contact: Array.isArray(parsed.layouts?.contact) ? parsed.layouts.contact : [],
          },
          selectedStickerId: null,
          undoStack: [],
          redoStack: [],
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_STICKER_STATE;
  });

  // Synchronize stickers state to localStorage and broadcast event
  const isInitialStickerMount = useRef(true);
  useEffect(() => {
    if (isInitialStickerMount.current) {
      isInitialStickerMount.current = false;
      return;
    }
    try {
      localStorage.setItem('siri_portfolio_stickers_v1', JSON.stringify({
        library: stickers.library,
        layouts: stickers.layouts,
      }));
      window.dispatchEvent(new Event('stickersUpdated'));
    } catch (e) {
      console.warn('[PortfolioContext] Failed to cache stickers locally:', e);
    }
  }, [stickers.library, stickers.layouts]);

  const [adminPin, setAdminPin] = useState<string>(() => {
    if (!import.meta.env.DEV) return '';
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || localStorage.getItem(LEGACY_KEYS.ADMIN_PIN) || 'siri2025';
  });

  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SAVED) || localStorage.getItem(LEGACY_KEYS.LAST_SAVED) || 'Just now';
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true') return true;
    }
    return false;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (!import.meta.env.DEV) return false;
    return (
      localStorage.getItem(STORAGE_KEYS.AUTH) === 'true' ||
      localStorage.getItem(LEGACY_KEYS.AUTH) === 'true'
    );
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(() => {
    // Only block initial rendering if the visitor has never loaded the site before (cache empty)
    return !localStorage.getItem(STORAGE_KEYS.PROFILE);
  });

  // Helper: Upload Base64 image to Supabase Storage bucket and return public CDN URL
  async function uploadDataUrlToStorage(
    bucket: string,
    path: string,
    dataUrl: string
  ): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const contentType = dataUrl.split(';')[0]?.replace('data:', '') || 'image/png';

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, blob, {
          upsert: true,
          contentType,
          cacheControl: '3600',
        });

      if (error) {
        console.warn('[Storage] Image upload to Supabase returned error:', error.message);
        return null;
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      return `${urlData.publicUrl}?t=${Date.now()}`;
    } catch (err: any) {
      console.warn('[Storage] Image upload exception:', err?.message);
      return null;
    }
  }

  // Synchronize live portfolio content from Supabase on initial mount
  useEffect(() => {
    let isMounted = true;

    async function syncLivePortfolio() {
      if (!isSupabaseConfigured() || !supabase) {
        if (isMounted) setIsInitialLoading(false);
        return;
      }

      try {
        const { data: record, error } = await supabase
          .from('portfolio_profile')
          .select('data, updated_at')
          .eq('id', 'siri')
          .maybeSingle();

        if (error) {
          console.warn('[PortfolioContext] Failed to fetch live portfolio:', error.message);
          if (isMounted) setIsInitialLoading(false);
          return;
        }

        if (record && record.data && typeof record.data === 'object' && Object.keys(record.data).length > 0) {
          const doc = record.data;

          if (isMounted) {
            // 1. Profile & About
            if (doc.profile && typeof doc.profile === 'object') {
              setProfile((prev) => ({
                ...INITIAL_PROFILE,
                ...doc.profile,
                aboutDetails: doc.profile.aboutDetails || INITIAL_ABOUT_DETAILS,
              }));
              localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(doc.profile));
            }

            // 2. Projects
            if (Array.isArray(doc.projects)) {
              setProjects(doc.projects);
              localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(doc.projects));
            }

            // 3. Skills
            if (Array.isArray(doc.skills)) {
              setSkills(doc.skills);
              localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(doc.skills));
            }

            // 4. Certifications
            if (Array.isArray(doc.certifications)) {
              setCertifications(doc.certifications);
              localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(doc.certifications));
            }

            // 5. Achievements
            if (Array.isArray(doc.achievements)) {
              setAchievements(doc.achievements);
              localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(doc.achievements));
            }

            // 6. Branding
            if (doc.branding && typeof doc.branding === 'object') {
              setBranding((prev) => ({ ...INITIAL_BRANDING, ...doc.branding }));
              localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(doc.branding));
            }

            // 7. Section Content
            if (doc.sectionsContent && typeof doc.sectionsContent === 'object') {
              setSectionsContent((prev) => ({ ...INITIAL_SECTIONS, ...doc.sectionsContent }));
              localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(doc.sectionsContent));
            }

            // 8. Detailed Decorations
            if (doc.detailedDecorations && typeof doc.detailedDecorations === 'object') {
              setDetailedDecorations((prev) => ({ ...INITIAL_DETAILED_DECORATIONS, ...doc.detailedDecorations }));
              localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(doc.detailedDecorations));
            }

            // 9. Stickers
            if (doc.stickers && typeof doc.stickers === 'object') {
              const loadedStickers: StickerEditorState = {
                library: Array.isArray(doc.stickers.library) ? doc.stickers.library : [],
                layouts: {
                  homepage: Array.isArray(doc.stickers.layouts?.homepage) ? doc.stickers.layouts.homepage : [],
                  about: Array.isArray(doc.stickers.layouts?.about) ? doc.stickers.layouts.about : [],
                  projects: Array.isArray(doc.stickers.layouts?.projects) ? doc.stickers.layouts.projects : [],
                  credentials: Array.isArray(doc.stickers.layouts?.credentials) ? doc.stickers.layouts.credentials : [],
                  achievements: Array.isArray(doc.stickers.layouts?.achievements) ? doc.stickers.layouts.achievements : [],
                  certifications: Array.isArray(doc.stickers.layouts?.certifications) ? doc.stickers.layouts.certifications : [],
                  contact: Array.isArray(doc.stickers.layouts?.contact) ? doc.stickers.layouts.contact : [],
                },
                selectedStickerId: null,
                undoStack: [],
                redoStack: [],
              };
              setStickers(loadedStickers);
              try {
                localStorage.setItem('siri_portfolio_stickers_v1', JSON.stringify({
                  library: loadedStickers.library,
                  layouts: loadedStickers.layouts,
                }));
                window.dispatchEvent(new Event('stickersUpdated'));
              } catch (e) {
                // ignore
              }
            }

            // 10. Last saved timestamp
            if (record.updated_at) {
              const formattedTime = new Date(record.updated_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              setLastSavedTimestamp(formattedTime);
              localStorage.setItem(STORAGE_KEYS.LAST_SAVED, formattedTime);
            }
          }
        }
      } catch (err: any) {
        console.warn('[PortfolioContext] Supabase live sync exception:', err?.message);
      } finally {
        if (isMounted) setIsInitialLoading(false);
      }
    }

    syncLivePortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load persistent photo & custom logo from IndexedDB if not already defined as a remote CDN URL
  useEffect(() => {
    getMediaItem('profile_photo').then((storedPhoto) => {
      if (storedPhoto) {
        setProfile((prev) => {
          if (prev.photoUrl && (prev.photoUrl.startsWith('http://') || prev.photoUrl.startsWith('https://'))) {
            return prev;
          }
          return { ...prev, photoUrl: storedPhoto };
        });
      }
    });

    getMediaItem('custom_logo').then((storedLogo) => {
      if (storedLogo) {
        setBranding((prev) => {
          if (prev.logoImageUrl && (prev.logoImageUrl.startsWith('http://') || prev.logoImageUrl.startsWith('https://'))) {
            return prev;
          }
          return { ...prev, logoImageUrl: storedLogo };
        });
      }
    });
  }, []);

  // Synchronize browser tab title with branding state
  useEffect(() => {
    if (branding.browserTabTitle) {
      document.title = branding.browserTabTitle;
    }
  }, [branding.browserTabTitle]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'bordeaux' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const loginAdmin = (enteredPin: string): boolean => {
    // In production, local passcode fallback is permanently disabled
    if (!import.meta.env.DEV) {
      console.warn('Local passcode login is blocked in production builds.');
      return false;
    }
    if (adminPin && enteredPin === adminPin) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      showToast('Admin Console Unlocked', 'Welcome to the Portfolio CMS.', 'success');
      return true;
    }
    showToast('Incorrect Passcode', 'Please check your admin passcode.', 'info');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('Signed Out', 'Admin session locked.', 'info');
  };

  const updateAdminPin = (newPin: string): boolean => {
    if (!import.meta.env.DEV) {
      showToast('Action Blocked', 'Passcode modifications are disabled in production builds.', 'info');
      return false;
    }
    if (newPin.trim().length < 4) {
      showToast('Passcode Too Short', 'Minimum 4 characters required.', 'info');
      return false;
    }
    setAdminPin(newPin);
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
    showToast('Passcode Updated', 'New master passcode active.', 'success');
    return true;
  };

  const [isSaving, setIsSaving] = useState(false);

  // Commit all state to LocalStorage and publish live to Supabase
  const saveAllChanges = async (): Promise<boolean> => {
    if (isSaving) return false;
    setIsSaving(true);

    try {
      // 1. Always save locally first so work is never lost
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
        localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certifications));
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
        localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(branding));
        localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sectionsContent));
        localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(detailedDecorations));
        localStorage.setItem('siri_portfolio_stickers_v1', JSON.stringify({
          library: stickers.library || [],
          layouts: stickers.layouts || {},
        }));
        window.dispatchEvent(new Event('stickersUpdated'));

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTimestamp(now);
        localStorage.setItem(STORAGE_KEYS.LAST_SAVED, now);
      } catch (e) {
        console.warn('[PortfolioContext] Local storage write notice:', e);
      }

      // 2. Prepare complete centralized payload
      const payload: PortfolioDocument = {
        version: 4,
        exportDate: new Date().toISOString(),
        branding,
        profile,
        sectionsContent,
        detailedDecorations,
        projects,
        skills,
        certifications,
        achievements,
        stickers: {
          library: stickers.library || [],
          layouts: stickers.layouts || {},
        },
      };

      // 3. If Supabase is active, verify authenticated session and UPSERT
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError || !session) {
            showToast(
              'Saved Locally Only',
              'Draft saved to browser cache. Sign in with Supabase to publish changes live to the website.',
              'info'
            );
            setHasUnsavedChanges(true);
            return false;
          }

          const { error: upsertError } = await supabase.from('portfolio_profile').upsert(
            {
              id: 'siri',
              data: payload,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

          if (upsertError) {
            console.error('[PortfolioContext] Supabase upsert error:', upsertError);
            showToast(
              'Publishing Failed',
              `Changes saved to local draft, but failed to publish live: ${upsertError.message}`,
              'info'
            );
            setHasUnsavedChanges(true);
            return false;
          }

          // Also synchronize dedicated portfolio_stickers rows per page
          try {
            const pageEntries = Object.entries(stickers.layouts || {});
            for (const [pageId, placedList] of pageEntries) {
              await supabase.from('portfolio_stickers').upsert(
                {
                  page_id: pageId,
                  stickers: placedList || [],
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'page_id' }
              );
            }
          } catch (stkSyncErr) {
            console.warn('[PortfolioContext] Per-page portfolio_stickers sync notice:', stkSyncErr);
          }

          // Successfully published live!
          setHasUnsavedChanges(false);
          showToast(
            'Published Live!',
            'All changes saved to Supabase and published live for all visitors.',
            'success'
          );
          return true;
        } catch (dbErr: any) {
          console.error('[PortfolioContext] Supabase upsert exception:', dbErr);
          showToast(
            'Publishing Exception',
            `Draft saved locally, but database sync encountered an error: ${dbErr?.message || 'Network error'}`,
            'info'
          );
          setHasUnsavedChanges(true);
          return false;
        }
      }

      // 4. Offline / Dev mode fallback
      setHasUnsavedChanges(false);
      showToast('Local Draft Saved', 'Saved to local browser cache (offline dev mode).', 'success');
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  const discardUnsavedChanges = () => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem(LEGACY_KEYS.PROFILE);
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS) || localStorage.getItem(LEGACY_KEYS.PROJECTS);
    const savedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS) || localStorage.getItem(LEGACY_KEYS.SKILLS);
    const savedCerts = localStorage.getItem(STORAGE_KEYS.CERTS) || localStorage.getItem(LEGACY_KEYS.CERTS);
    const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || localStorage.getItem(LEGACY_KEYS.ACHIEVEMENTS);
    const savedBranding = localStorage.getItem(STORAGE_KEYS.BRANDING);
    const savedSections = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    const savedDecorations = localStorage.getItem(STORAGE_KEYS.DECORATIONS);

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    if (savedCerts) setCertifications(JSON.parse(savedCerts));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    if (savedBranding) setBranding(JSON.parse(savedBranding));
    if (savedSections) setSectionsContent(JSON.parse(savedSections));
    if (savedDecorations) setDetailedDecorations(JSON.parse(savedDecorations));

    const savedStickers = localStorage.getItem('siri_portfolio_stickers_v1');
    if (savedStickers) {
      try {
        const parsed = JSON.parse(savedStickers);
        setStickers({
          library: Array.isArray(parsed.library) ? parsed.library : [],
          layouts: {
            homepage: Array.isArray(parsed.layouts?.homepage) ? parsed.layouts.homepage : [],
            about: Array.isArray(parsed.layouts?.about) ? parsed.layouts.about : [],
            projects: Array.isArray(parsed.layouts?.projects) ? parsed.layouts.projects : [],
            credentials: Array.isArray(parsed.layouts?.credentials) ? parsed.layouts.credentials : [],
            achievements: Array.isArray(parsed.layouts?.achievements) ? parsed.layouts.achievements : [],
            certifications: Array.isArray(parsed.layouts?.certifications) ? parsed.layouts.certifications : [],
            contact: Array.isArray(parsed.layouts?.contact) ? parsed.layouts.contact : [],
          },
          selectedStickerId: null,
          undoStack: [],
          redoStack: [],
        });
      } catch (e) {
        // ignore
      }
    }

    setHasUnsavedChanges(false);
    showToast('Unsaved Edits Discarded', 'Restored previous saved version.', 'info');
  };

  // Profile Updates
  const updateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    setHasUnsavedChanges(true);
  };

  const uploadProfilePhoto = async (dataUrl: string) => {
    // 1. Always store in local IndexedDB backup
    await saveMediaItem('profile_photo', dataUrl);

    // 2. Attempt upload to public Supabase Storage bucket
    let publicUrl: string | null = null;
    if (isSupabaseConfigured() && supabase) {
      const ext = dataUrl.includes('image/webp') ? 'webp' : 'png';
      publicUrl = await uploadDataUrlToStorage('portfolio-assets', `uploads/profile-photo.${ext}`, dataUrl);
    }

    const effectiveUrl = publicUrl || dataUrl;
    setProfile((prev) => ({ ...prev, photoUrl: effectiveUrl }));
    setHasUnsavedChanges(true);

    if (publicUrl) {
      showToast('Photo Uploaded to Storage', 'Photo stored on Supabase CDN for all public visitors.', 'success');
    } else {
      showToast('Photo Saved Locally', 'Photo stored in local IndexedDB. Sign in as admin to publish to CDN.', 'info');
    }
  };

  const removeProfilePhoto = async () => {
    await deleteMediaItem('profile_photo');
    setProfile((prev) => ({ ...prev, photoUrl: undefined }));
    setHasUnsavedChanges(true);
    showToast('Photo Removed', 'Reverted to illustrated avatar.', 'info');
  };

  // Branding Updates
  const updateBranding = (newBranding: SiteBranding) => {
    setBranding(newBranding);
    setHasUnsavedChanges(true);
  };

  const uploadCustomLogo = async (dataUrl: string) => {
    await saveMediaItem('custom_logo', dataUrl);

    let publicUrl: string | null = null;
    if (isSupabaseConfigured() && supabase) {
      const ext = dataUrl.includes('image/webp') ? 'webp' : 'png';
      publicUrl = await uploadDataUrlToStorage('portfolio-assets', `uploads/custom-logo.${ext}`, dataUrl);
    }

    const effectiveUrl = publicUrl || dataUrl;
    setBranding((prev) => ({ ...prev, logoImageUrl: effectiveUrl, logoType: 'customImage' }));
    setHasUnsavedChanges(true);

    if (publicUrl) {
      showToast('Logo Uploaded to Storage', 'Custom logo stored on Supabase CDN for all public visitors.', 'success');
    } else {
      showToast('Logo Saved Locally', 'Logo stored in local IndexedDB.', 'info');
    }
  };

  const removeCustomLogo = async () => {
    await deleteMediaItem('custom_logo');
    setBranding((prev) => ({ ...prev, logoImageUrl: undefined, logoType: 'monogram' }));
    setHasUnsavedChanges(true);
    showToast('Logo Removed', 'Reverted to handcrafted monogram.', 'info');
  };

  // Section Content Updates
  const updateSectionContent = (newSections: SectionContentConfig) => {
    setSectionsContent(newSections);
    setHasUnsavedChanges(true);
  };

  // Detailed Decorations Updates
  const updateDetailedDecorations = (newDec: DetailedDecorationsConfig) => {
    setDetailedDecorations(newDec);
    setHasUnsavedChanges(true);
  };

  // Visual Stickers Updates
  const updateStickers = useCallback((
    newStickers: StickerEditorState | ((prev: StickerEditorState) => StickerEditorState)
  ) => {
    setStickers(newStickers);
    setHasUnsavedChanges(true);
  }, []);

  // Projects CRUD
  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setHasUnsavedChanges(true);
    showToast('Project Created', `"${project.title}" added to CMS backlog.`, 'success');
  };

  const updateProject = (project: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    if (selectedProject?.id === project.id) {
      setSelectedProject(project);
    }
    setHasUnsavedChanges(true);
    showToast('Project Updated', `"${project.title}" changes staged.`, 'success');
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    setHasUnsavedChanges(true);
    showToast('Project Deleted', target ? `"${target.title}" removed.` : 'Project deleted.');
  };

  const duplicateProject = (id: string) => {
    const existing = projects.find((p) => p.id === id);
    if (!existing) return;
    const duplicated: Project = {
      ...existing,
      id: `${existing.id}-copy-${Date.now().toString().slice(-4)}`,
      title: `${existing.title} (Copy)`,
      slug: `${existing.slug}-copy`,
      order: projects.length + 1,
      published: false,
    };
    setProjects((prev) => [duplicated, ...prev]);
    setHasUnsavedChanges(true);
    showToast('Project Duplicated', `Created draft copy of "${existing.title}".`);
  };

  const moveProjectOrder = (id: string, direction: 'up' | 'down') => {
    const index = projects.findIndex((p) => p.id === id);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    const reordered = newProjects.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);
    setHasUnsavedChanges(true);
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    const result = Array.from(projects);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = result.map((item, idx) => ({ ...item, order: idx + 1 }));
    setProjects(updated);
    setHasUnsavedChanges(true);
  };

  // Skills CRUD
  const addSkill = (skill: SkillItem) => {
    setSkills((prev) => [...prev, skill]);
    setHasUnsavedChanges(true);
    showToast('Skill Added', `${skill.name} added to ${skill.category}.`);
  };

  const updateSkill = (index: number, updatedSkill: SkillItem) => {
    setSkills((prev) => {
      const copy = [...prev];
      copy[index] = updatedSkill;
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  const deleteSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== name));
    setHasUnsavedChanges(true);
    showToast('Skill Removed', `${name} removed.`);
  };

  // Experience CRUD
  const addExperience = (exp: ExperienceItem) => {
    setProfile((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), exp],
    }));
    setHasUnsavedChanges(true);
    showToast('Experience Added', exp.role);
  };

  const updateExperience = (exp: ExperienceItem) => {
    setProfile((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).map((e) => (e.id === exp.id ? exp : e)),
    }));
    setHasUnsavedChanges(true);
    showToast('Experience Updated', exp.role);
  };

  const deleteExperience = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((e) => e.id !== id),
    }));
    setHasUnsavedChanges(true);
    showToast('Experience Removed', 'Entry deleted.');
  };

  // Certifications CRUD
  const addCertification = (cert: Certification) => {
    setCertifications((prev) => [cert, ...prev]);
    setHasUnsavedChanges(true);
    showToast('Certification Added', cert.title);
  };

  const updateCertification = (cert: Certification) => {
    setCertifications((prev) => prev.map((c) => (c.id === cert.id ? cert : c)));
    setHasUnsavedChanges(true);
    showToast('Certification Updated', cert.title);
  };

  const deleteCertification = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    setHasUnsavedChanges(true);
    showToast('Certification Removed', 'Entry removed.');
  };

  // Achievements CRUD
  const addAchievement = (a: Achievement) => {
    setAchievements((prev) => [a, ...prev]);
    setHasUnsavedChanges(true);
    showToast('Achievement Added', a.title);
  };

  const updateAchievement = (a: Achievement) => {
    setAchievements((prev) => prev.map((item) => (item.id === a.id ? a : item)));
    setHasUnsavedChanges(true);
    showToast('Achievement Updated', a.title);
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((item) => item.id !== id));
    setHasUnsavedChanges(true);
    showToast('Achievement Removed', 'Entry removed.');
  };

  // Social Links CRUD
  const addSocialLink = (link: SocialLink) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), link],
    }));
    setHasUnsavedChanges(true);
  };

  const updateSocialLink = (link: SocialLink) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map((l) => (l.id === link.id ? link : l)),
    }));
    setHasUnsavedChanges(true);
  };

  const deleteSocialLink = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((l) => l.id !== id),
    }));
    setHasUnsavedChanges(true);
  };

  // Export & Import
  const exportPortfolioData = (): string => {
    const data: PortfolioDocument = {
      version: 4,
      exportDate: new Date().toISOString(),
      branding,
      profile,
      sectionsContent,
      detailedDecorations,
      projects,
      skills,
      certifications,
      achievements,
      stickers: {
        library: stickers.library || [],
        layouts: stickers.layouts || {},
      },
    };
    return JSON.stringify(data, null, 2);
  };

  const importPortfolioData = (jsonStr: string): boolean => {
    try {
      if (!jsonStr || typeof jsonStr !== 'string') {
        showToast('Import Failed', 'Uploaded file is empty.', 'info');
        return false;
      }

      const data = JSON.parse(jsonStr);

      // Validation: verify data is an object and contains expected core structure
      if (typeof data !== 'object' || data === null) {
        showToast('Validation Error', 'Backup file must contain a valid JSON object.', 'info');
        return false;
      }

      const hasRecognizedData =
        Boolean(data.profile) ||
        Boolean(data.projects) ||
        Boolean(data.branding) ||
        Boolean(data.skills) ||
        Boolean(data.sectionsContent);

      if (!hasRecognizedData) {
        showToast('Incompatible File', 'This file does not appear to be a Siri Portfolio backup.', 'info');
        return false;
      }

      // 1. AUTOMATIC PRE-RESTORE BACKUP of current state
      try {
        const currentBackup = exportPortfolioData();
        localStorage.setItem('siri_portfolio_pre_restore_backup', currentBackup);
      } catch (backupErr) {
        console.warn('Could not cache pre-restore snapshot:', backupErr);
      }

      // 2. Safely apply updates with fallbacks
      if (data.branding && typeof data.branding === 'object') {
        const mergedBranding = { ...INITIAL_BRANDING, ...data.branding };
        setBranding(mergedBranding);
        localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(mergedBranding));
      }
      if (data.profile && typeof data.profile === 'object') {
        const mergedProfile = {
          ...INITIAL_PROFILE,
          ...data.profile,
          aboutDetails: data.profile.aboutDetails || INITIAL_ABOUT_DETAILS,
        };
        setProfile(mergedProfile);
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(mergedProfile));
      }
      if (data.sectionsContent && typeof data.sectionsContent === 'object') {
        const mergedSections = { ...INITIAL_SECTIONS, ...data.sectionsContent };
        setSectionsContent(mergedSections);
        localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(mergedSections));
      }
      if (data.detailedDecorations && typeof data.detailedDecorations === 'object') {
        const mergedDecorations = {
          wordle: { ...INITIAL_DETAILED_DECORATIONS.wordle, ...(data.detailedDecorations.wordle || {}) },
          callaLily: { ...INITIAL_DETAILED_DECORATIONS.callaLily, ...(data.detailedDecorations.callaLily || {}) },
          tigerLily1: { ...INITIAL_DETAILED_DECORATIONS.tigerLily1, ...(data.detailedDecorations.tigerLily1 || {}) },
          tigerLily2: { ...INITIAL_DETAILED_DECORATIONS.tigerLily2, ...(data.detailedDecorations.tigerLily2 || {}) },
          orchid: { ...INITIAL_DETAILED_DECORATIONS.orchid, ...(data.detailedDecorations.orchid || {}) },
          pacman: { ...INITIAL_DETAILED_DECORATIONS.pacman, ...(data.detailedDecorations.pacman || {}) },
          vintageCamera: { ...INITIAL_DETAILED_DECORATIONS.vintageCamera, ...(data.detailedDecorations.vintageCamera || {}) },
          instantCamera: { ...INITIAL_DETAILED_DECORATIONS.instantCamera, ...(data.detailedDecorations.instantCamera || {}) },
          microchip: { ...INITIAL_DETAILED_DECORATIONS.microchip, ...(data.detailedDecorations.microchip || {}) },
        };
        setDetailedDecorations(mergedDecorations);
        localStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify(mergedDecorations));
      }
      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      }
      if (Array.isArray(data.skills)) {
        setSkills(data.skills);
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(data.skills));
      }
      if (Array.isArray(data.certifications)) {
        setCertifications(data.certifications);
        localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(data.certifications));
      }
      if (Array.isArray(data.achievements)) {
        setAchievements(data.achievements);
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      }

      // 3. Restore stickers if present
      if (data.stickers && typeof data.stickers === 'object') {
        const importedStickers: StickerEditorState = {
          library: Array.isArray(data.stickers.library) ? data.stickers.library : [],
          layouts: {
            homepage: Array.isArray(data.stickers.layouts?.homepage) ? data.stickers.layouts.homepage : [],
            about: Array.isArray(data.stickers.layouts?.about) ? data.stickers.layouts.about : [],
            projects: Array.isArray(data.stickers.layouts?.projects) ? data.stickers.layouts.projects : [],
            credentials: Array.isArray(data.stickers.layouts?.credentials) ? data.stickers.layouts.credentials : [],
            achievements: Array.isArray(data.stickers.layouts?.achievements) ? data.stickers.layouts.achievements : [],
            certifications: Array.isArray(data.stickers.layouts?.certifications) ? data.stickers.layouts.certifications : [],
            contact: Array.isArray(data.stickers.layouts?.contact) ? data.stickers.layouts.contact : [],
          },
          selectedStickerId: null,
          undoStack: [],
          redoStack: [],
        };
        setStickers(importedStickers);
        try {
          localStorage.setItem('siri_portfolio_stickers_v1', JSON.stringify({
            library: importedStickers.library,
            layouts: importedStickers.layouts,
          }));
          window.dispatchEvent(new Event('stickersUpdated'));
        } catch (e) {
          console.warn('Sticker restore error:', e);
        }
      }

      setHasUnsavedChanges(true);
      showToast('Backup Restored', 'Portfolio backup loaded into editor. Click "Save All Changes" to publish live to Supabase.', 'success');
      return true;
    } catch (e: any) {
      showToast('Import Failed', e?.message || 'Invalid or corrupted JSON backup file format.', 'info');
      return false;
    }
  };

  const resetToDefaults = () => {
    setBranding(INITIAL_BRANDING);
    setProfile(INITIAL_PROFILE);
    setSectionsContent(INITIAL_SECTIONS);
    setDetailedDecorations(INITIAL_DETAILED_DECORATIONS);
    setProjects(INITIAL_PROJECTS);
    setSkills(INITIAL_SKILLS);
    setCertifications(INITIAL_CERTIFICATIONS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setStickers(INITIAL_STICKER_STATE);

    localStorage.removeItem(STORAGE_KEYS.BRANDING);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.DECORATIONS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.CERTS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem('siri_portfolio_stickers_v1');
    window.dispatchEvent(new Event('stickersUpdated'));

    setHasUnsavedChanges(false);
    showToast('Reset to Defaults', 'Original portfolio template restored.', 'info');
  };

  return (
    <PortfolioContext.Provider
      value={{
        isInitialLoading,
        profile,
        projects,
        skills,
        certifications,
        achievements,
        branding,
        sectionsContent,
        detailedDecorations,
        stickers,
        updateStickers,
        selectedProject,
        setSelectedProject,
        isResumeOpen,
        setIsResumeOpen,
        selectedCert,
        setSelectedCert,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        adminPin,
        updateAdminPin,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        isSaving,
        saveAllChanges,
        discardUnsavedChanges,
        lastSavedTimestamp,
        addProject,
        updateProject,
        deleteProject,
        duplicateProject,
        moveProjectOrder,
        reorderProjects,
        updateProfile,
        uploadProfilePhoto,
        removeProfilePhoto,
        updateBranding,
        uploadCustomLogo,
        removeCustomLogo,
        updateSectionContent,
        updateDetailedDecorations,
        addSkill,
        updateSkill,
        deleteSkill,
        addExperience,
        updateExperience,
        deleteExperience,
        addCertification,
        updateCertification,
        deleteCertification,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        exportPortfolioData,
        importPortfolioData,
        resetToDefaults,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
