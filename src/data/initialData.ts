import { 
  Project, 
  SkillItem, 
  Certification, 
  Achievement, 
  ProfileData,
  SiteBranding,
  SectionContentConfig,
  DetailedDecorationsConfig,
  AboutContentConfig
} from '../types/portfolio';

export const INITIAL_BRANDING: SiteBranding = {
  websiteTitle: 'Siri Billakanti',
  browserTabTitle: 'Siri Billakanti | Portfolio',
  metaDescription: 'Personal portfolio of Siri Billakanti — Computer Science student, software developer, and creative builder.',
  logoType: 'monogram',
  monogramText: 'SB',
  footerCopyright: '© 2026 Siri Billakanti. Crafted with care, mathematics, and curiosity.',
};

export const INITIAL_SECTIONS: SectionContentConfig = {
  work: {
    title: 'Projects',
    subtitle: 'Exhibition of technical systems and software craft',
    description: 'Computer vision applications, real-time web systems, client-side encryption, and distributed tools.',
  },
  about: {
    title: 'About Me',
    subtitle: 'Computer Science Student & Creative Engineer',
    description: 'Curating software craft, systems correctness, and playful digital experiences.',
  },
  stack: {
    title: 'Tech Stack & Tools',
    subtitle: 'Languages, frameworks, distributed systems & development tools',
    description: 'Evaluated by production experience, systems correctness, and design excellence.',
  },
  credentials: {
    title: 'Certifications & Achievements',
    subtitle: 'Industry credentials, competitive hackathons, and honors',
    description: 'Verified technical certifications and competitive achievements.',
  },
  resume: {
    title: 'Resume',
    subtitle: 'Academic background, coursework, engineering experience, and technical references',
    description: 'Print-ready / Save as PDF',
  },
  contact: {
    title: 'Contact',
    subtitle: 'Direct Correspondence',
    description: 'Open to software engineering internships, research collaborations, and discussing creative technology.',
  },
};

export const INITIAL_DETAILED_DECORATIONS: DetailedDecorationsConfig = {
  wordle: {
    visible: true,
    xPercent: 3,
    yPercent: -12,
    scale: 1.0,
    rotation: -6,
    floatSpeed: 4.4,
    enableFloating: true,
    wordleLetters: ['S', 'I', 'R', 'I'],
    wordleColors: ['#538D4E', '#B59F3B', '#538D4E', '#538D4E'],
  },
  callaLily: {
    visible: true,
    xPercent: 82,
    yPercent: -15,
    scale: 1.05,
    rotation: 3,
    floatSpeed: 6.2,
    enableFloating: true,
  },
  tigerLily1: {
    visible: true,
    xPercent: 92,
    yPercent: 12,
    scale: 1.1,
    rotation: 3,
    floatSpeed: 6.8,
    enableFloating: true,
  },
  tigerLily2: {
    visible: true,
    xPercent: -10,
    yPercent: 62,
    scale: 0.95,
    rotation: -4,
    floatSpeed: 5.7,
    enableFloating: true,
  },
  pacman: {
    visible: true,
    xPercent: 90,
    yPercent: 82,
    scale: 1.0,
    rotation: 6,
    floatSpeed: 5.1,
    enableFloating: true,
  },
  vintageCamera: {
    visible: true,
    xPercent: 4,
    yPercent: 96,
    scale: 1.0,
    rotation: -5,
    floatSpeed: 4.8,
    enableFloating: true,
  },
  instantCamera: {
    visible: true,
    xPercent: 84,
    yPercent: 96,
    scale: 0.95,
    rotation: 6,
    floatSpeed: 5.2,
    enableFloating: true,
  },
  orchid: {
    visible: true,
    xPercent: -9,
    yPercent: 26,
    scale: 1.0,
    rotation: 2,
    floatSpeed: 5.8,
    enableFloating: true,
  },
  microchip: {
    visible: true,
    xPercent: 92,
    yPercent: 50,
    scale: 0.95,
    rotation: 12,
    floatSpeed: 4.6,
    enableFloating: true,
  },
};

export const INITIAL_ABOUT_DETAILS: AboutContentConfig = {
  heading: 'About Me',
  subtitle: 'Computer Science Student & Creative Engineer',
  description: 'Curating software craft, systems correctness, and playful digital experiences.',

  academicYearLabel: 'CS 2026',
  profileRole: 'Computer Science Student & Software Developer',
  opportunityStatus: 'Available for Summer & Fall Internships',
  profileQuote: '"Writing clean algorithms by day, designing playful interfaces by night."',

  philosophyTabLabel: 'Engineering Philosophy',
  philosophyHeading: 'Where Rigor Meets Tactile Play',
  philosophyParagraphs: [
    'I believe software is most powerful when it bridges invisible systems complexity with tangible, immediate responsiveness. A distributed data pipeline that synchronizes thousands of events per second should feel as seamless and tactile as turning a physical dial.',
    'In projects like GesturePac and GestureStudio, I explored how computer vision can break through glass boundaries to translate human kinetic intuition into software control. In Vaultly and InventoryOS, I engineered cryptographic guarantees and concurrency controls that protect sensitive user trust without sacrificing velocity.'
  ],
  philosophyHighlightCards: [
    {
      title: 'HIGH-THROUGHPUT RELIABILITY',
      description: 'Obsessed with sub-50ms latency, race condition prevention, and fault isolation.'
    },
    {
      title: 'KINETIC & TACTILE DESIGN',
      description: 'Every button click, keypress, and gesture trigger should have intentional physics and purpose.'
    }
  ],

  academicTabLabel: 'Academic Foundation',
  academicHeading: 'Bachelor of Science in Computer Science',
  degree: 'Bachelor of Science in Computer Science',
  institution: 'University Computer Science',
  period: '2022 — 2026',
  cgpa: '9.42 / 10.0',
  sgpa: '9.6 / 10.0',
  focus: 'Software Engineering, Computer Vision, Distributed Systems & Machine Learning',
  coursework: [
    'Data Structures & Algorithms',
    'Operating Systems & Systems Programming',
    'Computer Vision & Image Processing',
    'Distributed Systems & Cloud Computing',
    'Database Management Systems & SQL',
    'Object-Oriented Design & Design Patterns',
    'Machine Learning & Deep Neural Networks',
    'Computer Networks & Protocols'
  ],

  interestsTabLabel: 'Interests & Pursuits',
  interestsHeading: 'Explorations & Creative Sparks',
  interestsDescription: 'When not writing code or debugging memory allocations, I immerse myself in creative and analytical pursuits that feed back into my engineering practice:',
  interests: [
    'Computer Vision & Gesture Computing',
    'Distributed Systems & Concurrency',
    'Interactive Editorial Web Design',
    'Cryptographic Privacy & Zero-Knowledge',
    'Human-Computer Interaction (HCI)'
  ]
};

export const INITIAL_PROFILE: ProfileData = {
  name: 'Siri Billakanti',
  tagline: "Software Engineer & Creative Builder",
  role: 'Computer Science Student & Software Developer',
  shortBio: 'Creative builder crafting high-performance distributed systems, spatial computer vision experiences, and delightful digital interfaces.',
  editorialBio: [
    'I am a Computer Science student and software engineer who views programming as both rigorous engineering and expressive craft. My work sits at the intersection of computer vision, interactive systems, and scalable backend infrastructure.',
    'Whether I am translating subtle physical hand gestures into zero-latency game controls with OpenCV and MediaPipe, architecting real-time WebSocket state machines for competitive word games, or implementing client-side zero-knowledge encryption algorithms, I obsess over tactile feedback, systems correctness, and delightful human interaction.',
    'Beyond the terminal, you can find me analyzing algorithms, curating editorial design systems, and experimenting with creative technology.'
  ],
  availability: 'Available for Summer & Fall Software Engineering Internships',
  availabilityStatus: 'available',
  email: 'siri.billakanti1@gmail.com',
  github: 'https://github.com/siribillakanti',
  linkedin: 'https://linkedin.com/in/siri-billakanti',
  location: 'Open to Relocation & Remote',
  photoFrameShape: 'rounded',
  photoPosition: 'center',
  aboutDetails: INITIAL_ABOUT_DETAILS,
  heroCardConfig: {
    primaryButtonLabel: 'Explore Projects',
    secondaryButtonLabel: 'Inspect Resume',
    invitationText: 'Software engineer & creative developer',
  },
  decorationsConfig: {
    showWordle: true,
    showPacman: true,
    showCamera: true,
    showVintageCamera: true,
    showInstantCamera: true,
    showCallaLily: true,
    showOrchid: true,
    showTigerLily: true,
    showMicrochip: true,
  },
  education: {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University Computer Science',
    period: 'Expected Graduation 2026',
    focus: 'Software Engineering, Computer Vision, Distributed Systems & Machine Learning',
    coursework: [
      'Data Structures & Algorithms',
      'Operating Systems & Systems Programming',
      'Computer Vision & Image Processing',
      'Distributed Systems & Cloud Computing',
      'Database Management Systems & SQL',
      'Object-Oriented Design & Design Patterns',
      'Machine Learning & Deep Neural Networks',
      'Computer Networks & Protocols'
    ]
  },
  interests: [
    'Computer Vision & Gesture Computing',
    'Distributed Systems & Concurrency',
    'Interactive Editorial Web Design',
    'Cryptographic Privacy & Zero-Knowledge',
    'Human-Computer Interaction (HCI)'
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Project Lead & Research Developer',
      organization: 'Computer Vision & HCI Lab',
      period: '2024 - Present',
      location: 'University',
      description: 'Architecting zero-latency spatial computing interfaces and browser-based hand gesture recognition pipelines using MediaPipe, WebAssembly, and Canvas API.',
      type: 'research'
    },
    {
      id: 'exp-2',
      role: 'Workshop Lead & Technical Mentor',
      organization: 'Computer Science Student Association',
      period: '2023 - Present',
      location: 'Campus',
      description: 'Conducted interactive engineering workshops on Computer Vision with Python/OpenCV and full-stack development, mentoring over 40 junior undergraduates.',
      type: 'leadership'
    },
    {
      id: 'exp-3',
      role: 'Software Engineering Fellow',
      organization: 'Collegiate Hackathons & Open Source',
      period: '2023 - 2024',
      location: 'National',
      description: 'Engineered high-throughput full stack web applications, competitive WebSocket state engines, and client-side cryptographic security tools.',
      type: 'work'
    }
  ],
  socialLinks: [
    { id: 'soc-1', platform: 'GitHub', url: 'https://github.com/siribillakanti', label: 'github.com/siribillakanti' },
    { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com/in/siri-billakanti', label: 'linkedin.com/in/siri-billakanti' },
    { id: 'soc-3', platform: 'Email', url: 'mailto:siri.billakanti1@gmail.com', label: 'siri.billakanti1@gmail.com' }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'wordlerush',
    title: 'WordleRush',
    slug: 'wordlerush',
    subtitle: 'Competitive Real-Time Multiplayer Wordle Duel',
    tagline: 'High-speed multiplayer word battles with synchronized dictionary state & live opponent trackers',
    description: 'A fast-paced multiplayer Wordle arena with real-time WebSocket matchmaking, rapid-fire rounds, and competitive streak scoring.',
    longDescription: 'WordleRush turns the solitary puzzle into a thrilling competitive duel. Built on a resilient Node.js and WebSocket architecture with Redis session state, players face off in real-time word matches. The custom game engine handles instant dictionary validations, synchronized seed generation, animated opponent guess boards, and streak multipliers.',
    category: 'Full Stack Web Development',
    technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Tailwind CSS', 'Redis', 'Web Audio API'],
    githubUrl: 'https://github.com/siribillakanti/wordlerush',
    liveUrl: 'https://wordlerush.dev',
    accentColor: '#5C1327', // Deep bordeaux
    secondaryColor: '#F9E498', // Butter yellow
    textColor: '#FAF7EE',
    features: [
      'Bidirectional WebSocket synchronization with sub-30ms round-trip latency',
      'Live mini-board mirroring opponent guesses and tile reveals in real time',
      'Cryptographically seeded daily puzzles & custom private lobby duel rooms',
      'Dynamic Web Audio API synthesized tactile key click & victory audio feedback',
      'Optimized dictionary lookup using Trie data structures for instant word validity checks'
    ],
    architecture: [
      'Client: React 18 + TypeScript with Framer Motion flip transitions',
      'Server: Express + Socket.io running distributed room managers',
      'Caching: Redis in-memory storage for active duel state & leaderboards',
      'Validation: O(K) prefix trie containing 12,000+ accepted English vocabulary words'
    ],
    published: true,
    featured: true,
    objectRepresentation: 'wordle-tiles',
    previewType: 'wordle',
    order: 1
  },
  {
    id: 'gesturepac',
    title: 'GesturePac',
    slug: 'gesturepac',
    subtitle: 'Vision-Controlled Motion Arcade Pac-Man',
    tagline: 'Spatial hand tracking transforms the retro arcade classic into a touchless kinetic experience',
    description: 'An interactive retro arcade game where Pac-Man is navigated in real time through optical hand gesture tracking via OpenCV and MediaPipe.',
    longDescription: 'GesturePac eliminates keyboards and gamepads, turning a user’s hand in front of a standard webcam into a high-precision spatial joystick. By extracting 21 anatomical landmarks per hand at 60 FPS and computing vector orientations between the metacarpophalangeal and tip joints, GesturePac classifies directional intent with zero perceived lag.',
    category: 'Computer Vision & Interaction',
    technologies: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'Pygame', 'Multithreading'],
    githubUrl: 'https://github.com/siribillakanti/gesturepac',
    accentColor: '#2A102A', // Plum
    secondaryColor: '#F9E498', // Butter yellow Pac-Man color
    textColor: '#FAF7EE',
    features: [
      'Real-time 21-landmark 3D hand mesh extraction via Google MediaPipe',
      'Custom angular vector quantization algorithm converting hand posture to cardinal directions',
      'Multithreaded video capture decoupled from game simulation loop to preserve steady 60 FPS',
      'Visual on-screen HUD displaying active hand skeleton, confidence score, and directional vectors',
      'Faithful retro Pac-Man game mechanics including classic ghost scatter/chase state machines'
    ],
    architecture: [
      'Vision Pipeline: OpenCV webcam acquisition -> RGB normalization -> MediaPipe Hands detection',
      'Vector Engine: Angle calculation between wrist (0) and index MCP (5) / tip (8) vectors',
      'Smoothing: Moving-average temporal filter preventing jitter and false directional switches',
      'Game Loop: Pygame 60 FPS grid-based collision & entity state update dispatcher'
    ],
    published: true,
    featured: true,
    objectRepresentation: 'pacman-hero',
    previewType: 'pacman',
    order: 2
  },
  {
    id: 'gesturestudio',
    title: 'GestureStudio',
    slug: 'gesturestudio',
    subtitle: 'Spatial Motion Studio & Gesture Playground',
    tagline: 'Webcam-based spatial computing studio for recording, calibrating, and mapping custom gestures',
    description: 'A browser-based computer vision studio transforming consumer webcams into spatial controllers with real-time skeleton visualizers and kinetic playgrounds.',
    longDescription: 'GestureStudio is a web-first spatial interface lab that democratizes touchless computing. Operating entirely client-side using WebAssembly and MediaPipe, users can record custom static postures and dynamic motions, calibrate sensitivity thresholds, and pilot interactive physics environments or digital art canvases without installing native software.',
    category: 'Computer Vision & Interaction',
    technologies: ['TypeScript', 'MediaPipe', 'Canvas API', 'WebGL', 'Tailwind CSS', 'Web Audio API'],
    githubUrl: 'https://github.com/siribillakanti/gesturestudio',
    liveUrl: 'https://gesturestudio.app',
    accentColor: '#1D4ED8', // Cobalt blue
    secondaryColor: '#A8C69F', // Pistachio
    textColor: '#FAF7EE',
    features: [
      '100% client-side computer vision inference with zero server upload or latency',
      'Interactive particle & cloth physics simulation controlled by finger pinching and air-pinching',
      'Custom gesture recorder with customizable confidence thresholds and visual keypoint markers',
      'Web Audio frequency synthesizer modulated by hand elevation and palm distance',
      'Exportable JSON gesture profiles compatible with third-party web apps'
    ],
    architecture: [
      'Frontend: Next.js / TypeScript with custom Canvas 2D & WebGL particle buffers',
      'Inference: MediaPipe Vision Tasks loaded via WebAssembly for GPU acceleration',
      'Gesture Classifier: K-Nearest Neighbors (KNN) algorithm over normalized joint distance vectors',
      'State Engine: Reactive event bus dispatching custom DOM spatial gestures'
    ],
    published: true,
    featured: true,
    objectRepresentation: 'camera-lens',
    previewType: 'camera',
    order: 3
  },
  {
    id: 'vaultly',
    title: 'Vaultly',
    slug: 'vaultly',
    subtitle: 'Zero-Knowledge Client-Side Encrypted Secrets Locker',
    tagline: 'Cryptographically hardened personal password & credential manager with zero-plaintext knowledge',
    description: 'A modern, zero-knowledge credential vault built with client-side AES-256-GCM encryption, master passphrase key derivation, and biometric unlocking.',
    longDescription: 'Vaultly guarantees that no unencrypted secret ever leaves the client device. Using the native Web Crypto API, secrets are encrypted using 256-bit AES-GCM with unique initialization vectors (IVs) and master keys derived via PBKDF2 with 600,000 hash iterations. The backend database stores only opaque ciphertexts, ensuring complete privacy even against database leaks.',
    category: 'Cloud & Distributed Systems',
    technologies: ['React', 'TypeScript', 'Web Crypto API', 'Supabase', 'Tailwind CSS', 'PostgreSQL'],
    githubUrl: 'https://github.com/siribillakanti/vaultly',
    liveUrl: 'https://vaultly-secure.app',
    accentColor: '#3D153E', // Plum
    secondaryColor: '#F9E498', // Butter
    textColor: '#FAF7EE',
    features: [
      'Military-grade AES-256-GCM authenticated encryption performed exclusively in the browser',
      'PBKDF2-HMAC-SHA256 key stretching with 600,000 iterations to thwart brute-force attacks',
      'Cryptographically secure random password and passphrase generator with entropy scoring',
      'Client-side search running over decrypted memory without server query exposure',
      'Row Level Security (RLS) policies on Supabase PostgreSQL ensuring ironclad tenant isolation'
    ],
    architecture: [
      'Cryptographic Module: Native window.crypto.subtle primitives for tamper-proof operations',
      'Key Management: Master password never stored; session key kept in ephemeral memory only',
      'Storage: Supabase PostgreSQL receiving only ciphertext blobs, salt, and 96-bit IVs',
      'UI: High-speed responsive React dashboard with auto-clearing clipboard timers'
    ],
    published: true,
    featured: false,
    objectRepresentation: 'vault-dial',
    previewType: 'vault',
    order: 4
  },
  {
    id: 'inventoryos',
    title: 'InventoryOS',
    slug: 'inventoryos',
    subtitle: 'Real-Time Distributed Inventory Management Engine',
    tagline: 'High-throughput stock tracking platform with optimistic locking, event audit trails & automated restocking',
    description: 'A distributed inventory engine designed for fast-moving supply chains, featuring atomic updates, transaction logging, and real-time alerts.',
    longDescription: 'InventoryOS addresses concurrency collisions in multi-warehouse retail operations. By implementing optimistic concurrency control with PostgreSQL version tagging and Redis pub/sub event distribution, the system handles concurrent stock decrements without inventory drift or overselling.',
    category: 'Cloud & Distributed Systems',
    technologies: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/siribillakanti/inventoryos',
    accentColor: '#841C34', // Bordeaux
    secondaryColor: '#A8C69F', // Pistachio
    textColor: '#FAF7EE',
    features: [
      'Optimistic locking mechanism preventing dirty writes and overselling during flash events',
      'Comprehensive append-only audit ledger tracking every stock adjustment with timestamps and user IDs',
      'Automated low-stock notification triggers with configurable reorder thresholds',
      'Interactive analytics dashboard displaying SKU turnover velocity and shrinkage rates',
      'Dockerized container topology for reproducible local and cloud deployment'
    ],
    architecture: [
      'Backend Service: RESTful microservice with connection pooling & transaction isolation',
      'Database: PostgreSQL relational schema with foreign key integrity and B-tree indexes',
      'Pub/Sub: Redis channels broadcasting stock level changes to connected dashboard clients',
      'DevOps: Docker Compose orchestration with healthcheck probes and volume persistence'
    ],
    published: true,
    featured: false,
    objectRepresentation: 'isometric-box',
    previewType: 'inventory',
    order: 5
  },
  {
    id: 'docs-similarity',
    title: 'DOCS_SIMILARITY',
    slug: 'docs-similarity',
    subtitle: 'Semantic Document Intelligence & Vector Similarity Engine',
    tagline: 'Dense vector text analysis using transformer embeddings & geometric clustering',
    description: 'A semantic search and document comparison engine leveraging dense transformer embeddings, cosine distance metrics, and hierarchical clustering.',
    longDescription: 'DOCS_SIMILARITY moves beyond naive keyword matching to understand semantic meaning in textual corpora. By embedding documents into 384-dimensional dense vector spaces using MiniLM models, the engine computes pairwise cosine similarity matrices, identifies thematic clusters, and extracts semantic duplicates across massive document collections.',
    category: 'AI & Machine Learning',
    technologies: ['Python', 'PyTorch', 'Sentence-Transformers', 'FastAPI', 'Scikit-learn', 'NumPy'],
    githubUrl: 'https://github.com/siribillakanti/docs_similarity',
    accentColor: '#9F1D64', // Magenta
    secondaryColor: '#F9E498', // Butter
    textColor: '#FAF7EE',
    features: [
      'Transformer-based sentence encoding producing 384-dimensional dense vectors',
      'Pairwise cosine similarity matrix computation vectorized with NumPy for maximum performance',
      'Interactive 2D document space projection via UMAP dimensionality reduction',
      'Automated near-duplicate detection with adjustable threshold calibration',
      'High-throughput FastAPI microservice with automated OpenAPI documentation'
    ],
    architecture: [
      'Model: all-MiniLM-L6-v2 transformer model fine-tuned for semantic textual similarity',
      'Backend: FastAPI server with asynchronous request batching',
      'Analytics: Scikit-learn agglomerative hierarchical clustering algorithm',
      'Visualization: HTML5 Canvas rendering of interactive 2D spatial document coordinates'
    ],
    published: true,
    featured: false,
    objectRepresentation: 'manuscripts',
    previewType: 'similarity',
    order: 6
  },
  {
    id: 'feedbackai',
    title: 'FeedbackAI',
    slug: 'feedbackai',
    subtitle: 'Multimodal Feedback Synthesis & Product Intelligence Engine',
    tagline: 'Automated user voice clustering, sentiment scoring, and feature prioritization pipeline',
    description: 'An AI engine that ingests unstructured customer reviews, bug reports, and survey answers, categorizing them into actionable engineering roadmap items.',
    longDescription: 'FeedbackAI transforms chaotic, sprawling user feedback into clear engineering priorities. Leveraging the Gemini API and structured reasoning chains, the system ingests support tickets, app store reviews, and Discord comments, extracting underlying sentiment, tagging software components, and grouping duplicate feature requests into weighted product epics.',
    category: 'AI & Machine Learning',
    technologies: ['Python', 'Gemini API', 'LangChain', 'React', 'FastAPI', 'Tailwind CSS'],
    githubUrl: 'https://github.com/siribillakanti/feedbackai',
    accentColor: '#C72C61', // Raspberry
    secondaryColor: '#FAF7EE', // Warm Ivory
    textColor: '#FAF7EE',
    features: [
      'Multimodal ingestion supporting text reviews, customer screenshots, and error logs',
      'Few-shot LLM prompts generating deterministic JSON schemas with confidence scores',
      'Urgency vs. impact prioritization matrix automatically sorting feature backlog',
      'Sentiment distribution analytics tracking sentiment drift across software release cycles',
      'One-click export to GitHub Issues and Jira sprint backlogs'
    ],
    architecture: [
      'LLM Layer: Google Gemini API with structured function calling and JSON schema enforcement',
      'Pipeline: LangChain orchestration managing document chunking and prompt chaining',
      'API: Asynchronous FastAPI endpoints with token rate limiting and caching',
      'Dashboard: Responsive React UI with interactive data charts and filtering'
    ],
    published: true,
    featured: false,
    objectRepresentation: 'retro-cassette',
    previewType: 'feedback',
    order: 7
  }
];

export const INITIAL_SKILLS: SkillItem[] = [
  // Programming Languages
  { name: 'Python', category: 'languages', highlight: true, badge: 'Daily Driver' },
  { name: 'Java', category: 'languages', highlight: true, badge: 'Core OOP' },
  { name: 'C / C++', category: 'languages', highlight: true, badge: 'Systems' },
  { name: 'TypeScript', category: 'languages', highlight: true, badge: 'Modern Web' },
  { name: 'JavaScript (ES6+)', category: 'languages', highlight: false },
  { name: 'Go', category: 'languages', highlight: false, badge: 'Concurrent' },
  { name: 'SQL', category: 'languages', highlight: true, badge: 'Relational' },
  { name: 'HTML5 & CSS3', category: 'languages', highlight: false },

  // Frontend
  { name: 'React 18', category: 'frontend', highlight: true, badge: 'Preferred' },
  { name: 'Next.js', category: 'frontend', highlight: true },
  { name: 'Tailwind CSS', category: 'frontend', highlight: true, badge: 'Styling' },
  { name: 'Framer Motion', category: 'frontend', highlight: true, badge: 'Animations' },
  { name: 'GSAP & ScrollTrigger', category: 'frontend', highlight: true },
  { name: 'HTML5 Canvas API', category: 'frontend', highlight: false },
  { name: 'WebGL Basics', category: 'frontend', highlight: false },
  { name: 'Responsive UI Design', category: 'frontend', highlight: false },

  // Backend and Databases
  { name: 'Node.js', category: 'backend', highlight: true },
  { name: 'Express.js', category: 'backend', highlight: false },
  { name: 'FastAPI', category: 'backend', highlight: true, badge: 'High Perf' },
  { name: 'PostgreSQL', category: 'backend', highlight: true, badge: 'Primary DB' },
  { name: 'Supabase & RLS', category: 'backend', highlight: true },
  { name: 'Redis', category: 'backend', highlight: true, badge: 'In-Memory' },
  { name: 'Socket.io / WebSockets', category: 'backend', highlight: true },
  { name: 'RESTful API Design', category: 'backend', highlight: false },

  // AI / Machine Learning
  { name: 'OpenCV', category: 'ai', highlight: true, badge: 'Vision' },
  { name: 'MediaPipe Hands/Pose', category: 'ai', highlight: true, badge: 'Spatial' },
  { name: 'PyTorch', category: 'ai', highlight: true },
  { name: 'Gemini API', category: 'ai', highlight: true, badge: 'LLMs' },
  { name: 'Scikit-learn', category: 'ai', highlight: false },
  { name: 'Sentence-Transformers', category: 'ai', highlight: false },
  { name: 'NumPy & Pandas', category: 'ai', highlight: false },
  { name: 'Vector Embeddings', category: 'ai', highlight: false },

  // Tools and Platforms
  { name: 'Git & GitHub', category: 'tools', highlight: true, badge: 'VCS' },
  { name: 'Docker', category: 'tools', highlight: true, badge: 'Containers' },
  { name: 'Linux / Unix CLI', category: 'tools', highlight: true },
  { name: 'Vite', category: 'tools', highlight: false },
  { name: 'Postman', category: 'tools', highlight: false },
  { name: 'Vercel', category: 'tools', highlight: false },
  { name: 'VS Code', category: 'tools', highlight: false },
  { name: 'Jest / PyTest', category: 'tools', highlight: false }
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    title: 'DeepLearning.AI Machine Learning Specialization',
    issuer: 'DeepLearning.AI & Stanford Online',
    date: '2024',
    category: 'Cloud & AI',
    skills: ['Supervised Learning', 'Neural Networks', 'Unsupervised Learning', 'Recommender Systems'],
    credentialId: 'DLAI-ML-9824',
    featured: true
  },
  {
    id: 'cert-2',
    title: 'Computer Vision with OpenCV and Deep Learning',
    issuer: 'OpenCV / PyImageSearch Certification',
    date: '2024',
    category: 'Specialization',
    skills: ['OpenCV', 'Image Processing', 'Object Tracking', 'Face & Landmark Detection'],
    credentialId: 'CV-DL-7731',
    featured: true
  },
  {
    id: 'cert-3',
    title: 'Distributed Systems & Microservices Architecture',
    issuer: 'Software Engineering Institute & Online Academy',
    date: '2023',
    category: 'Software Engineering',
    skills: ['Concurrency', 'Distributed Caching', 'Event-Driven Systems', 'CAP Theorem'],
    credentialId: 'DIST-SYS-4412',
    featured: true
  },
  {
    id: 'cert-4',
    title: 'Full Stack Web Development & Modern React',
    issuer: 'Modern Developer Institute',
    date: '2023',
    category: 'Software Engineering',
    skills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL'],
    credentialId: 'FS-WEB-2209',
    featured: false
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Best Human-Computer Interaction Hack',
    event: 'Collegiate Hackathon 2024',
    date: 'November 2024',
    description: 'Awarded first place in the HCI category for building GestureStudio, recognized for real-time responsiveness and zero-calibration webcam hand tracking.',
    badgeColor: '#C72C61',
    type: 'hackathon'
  },
  {
    id: 'ach-2',
    title: 'Dean’s Honor List for Academic Excellence',
    event: 'College of Engineering & Computer Science',
    date: 'Multiple Semesters',
    description: 'Maintained top academic percentile across rigorous coursework in Algorithms, Operating Systems, Computer Vision, and Software Engineering.',
    badgeColor: '#1D4ED8',
    type: 'academic'
  },
  {
    id: 'ach-3',
    title: 'Open Source Contributor & Workshop Lead',
    event: 'Computer Science Student Association',
    date: '2023 - Present',
    description: 'Led technical workshops on Computer Vision with Python/OpenCV and mentored 40+ junior students in full-stack web development fundamentals.',
    badgeColor: '#A8C69F',
    type: 'leadership'
  }
];
