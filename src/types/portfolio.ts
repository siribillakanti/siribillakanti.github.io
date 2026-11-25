export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: 
    | 'AI & Machine Learning'
    | 'Computer Vision & Interaction'
    | 'Full Stack Web Development'
    | 'IoT & Embedded Systems'
    | 'Cloud & Distributed Systems'
    | 'Algorithms & Data Structures'
    | 'Creative Technology & Games'
    | 'Developer Tools & Productivity'
    // Legacy categories (backward compat)
    | 'Computer Vision & AI'
    | 'Full Stack Web'
    | 'Distributed Systems & Tools'
    | 'Creative Tech';
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string; // Custom uploaded image (DataURL or IndexedDB key)
  screenshots?: string[]; // Gallery screenshots
  accentColor: string; // e.g. '#C72C61', '#5C1327', '#1D4ED8', '#841C34', '#94B78A'
  secondaryColor: string;
  textColor: string;
  features: string[];
  architecture: string[];
  published: boolean;
  featured: boolean;
  objectRepresentation?: string;
  previewType: 'wordle' | 'pacman' | 'camera' | 'vault' | 'inventory' | 'similarity' | 'feedback';
  order: number;
}

export interface SkillItem {
  id?: string;
  name: string;
  highlight?: boolean;
  badge?: string;
  category: 'languages' | 'frontend' | 'backend' | 'ai' | 'tools';
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  category: 'Cloud & AI' | 'Software Engineering' | 'Specialization';
  skills: string[];
  featured?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  event: string;
  date: string;
  description: string;
  badgeColor: string;
  type: 'hackathon' | 'academic' | 'leadership';
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location?: string;
  description: string;
  type: 'work' | 'research' | 'leadership' | 'extracurricular';
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

export interface HeroCardConfig {
  primaryButtonLabel?: string;
  primaryButtonDestination?: string; // e.g. '#work'
  secondaryButtonLabel?: string;
  secondaryButtonDestination?: string; // e.g. 'resumeModal'
  invitationText?: string;
}

// Config for individual decorative objects
export interface DecorationItemConfig {
  visible: boolean;
  xPercent: number; // percentage offset
  yPercent: number; // percentage offset
  scale: number; // 0.5 to 2.0
  rotation: number; // degrees
  floatSpeed: number; // animation duration in seconds
  enableFloating: boolean;
  // Specific to Wordle:
  wordleLetters?: string[];
  wordleColors?: string[];
  type?: string;
  label?: string;
}

export interface DetailedDecorationsConfig {
  wordle: DecorationItemConfig;
  callaLily: DecorationItemConfig;
  tigerLily1: DecorationItemConfig;
  tigerLily2: DecorationItemConfig;
  pacman: DecorationItemConfig;
  vintageCamera: DecorationItemConfig;
  instantCamera: DecorationItemConfig;
  orchid: DecorationItemConfig;
  microchip: DecorationItemConfig;
  [key: string]: DecorationItemConfig;
}

// Legacy toggle for backward compatibility
export interface DecorationsConfig {
  showWordle?: boolean;
  showPacman?: boolean;
  showCamera?: boolean;
  showVintageCamera?: boolean;
  showInstantCamera?: boolean;
  showCallaLily?: boolean;
  showOrchid?: boolean;
  showTigerLily?: boolean;
  showMicrochip?: boolean;
}

// Website Branding & Identity
export interface SiteBranding {
  websiteTitle: string; // e.g. "Siri Billakanti"
  browserTabTitle: string; // e.g. "Siri Billakanti | Portfolio"
  metaDescription: string;
  logoType: 'monogram' | 'text' | 'customImage';
  monogramText: string; // e.g. "SB"
  logoImageUrl?: string; // custom uploaded dataURL
  footerCopyright: string;
  footerNotice?: string;
}

// Section Headings & Descriptions
export interface SectionHeadingItem {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
}

export interface SectionContentConfig {
  work: SectionHeadingItem;
  about: SectionHeadingItem;
  stack: SectionHeadingItem;
  credentials: SectionHeadingItem;
  resume: SectionHeadingItem;
  contact: SectionHeadingItem;
}

export interface HighlightCard {
  id?: string;
  title: string;
  description: string;
}

export interface AboutContentConfig {
  // A. About page introduction
  heading?: string;
  subtitle?: string;
  description?: string;

  // B. Profile card
  academicYearLabel?: string;
  profileRole?: string;
  opportunityStatus?: string;
  profileQuote?: string;

  // C. Engineering Philosophy tab
  philosophyTabLabel?: string;
  philosophyHeading?: string;
  philosophyParagraphs?: string[];
  philosophyHighlightCards?: HighlightCard[];

  // D. Academic Foundation tab
  academicTabLabel?: string;
  academicHeading?: string;
  degree?: string;
  institution?: string;
  period?: string;
  cgpa?: string;
  sgpa?: string;
  focus?: string;
  coursework?: string[];

  // E. Interests & Pursuits tab
  interestsTabLabel?: string;
  interestsHeading?: string;
  interestsDescription?: string;
  interests?: string[];
}

export interface ProfileData {
  name: string;
  tagline: string;
  role: string;
  shortBio: string;
  editorialBio: string[];
  availability: string;
  availabilityStatus: 'available' | 'busy' | 'exploring';
  email: string;
  github: string;
  linkedin: string;
  location: string;
  photoUrl?: string; // Custom uploaded profile photo
  photoFrameShape?: 'circle' | 'square' | 'rounded'; // Frame shape
  photoPosition?: 'center' | 'top' | 'bottom'; // Image focus
  heroCardConfig?: HeroCardConfig;
  decorationsConfig?: DecorationsConfig;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadDate?: string;
  aboutDetails?: AboutContentConfig;
  education: {
    degree: string;
    institution: string;
    period: string;
    focus: string;
    coursework: string[];
  };
  interests: string[];
  experiences?: ExperienceItem[];
  socialLinks?: SocialLink[];
}

export interface PortfolioDocument {
  version: number;
  exportDate: string;
  branding: SiteBranding;
  profile: ProfileData;
  sectionsContent: SectionContentConfig;
  detailedDecorations: DetailedDecorationsConfig;
  projects: Project[];
  skills: SkillItem[];
  certifications: Certification[];
  achievements: Achievement[];
  stickers?: any;
}
