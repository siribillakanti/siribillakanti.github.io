import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Download, Printer, Mail, Github, Linkedin, ExternalLink, Sparkles } from 'lucide-react';

export const ResumeModal: React.FC = () => {
  const { isResumeOpen, setIsResumeOpen, profile, projects, skills, certifications, showToast } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsResumeOpen(false);
    };
    if (isResumeOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isResumeOpen, setIsResumeOpen]);

  if (!isResumeOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Resume Download Initiated', 'Generating print-ready PDF view...', 'bordeaux');
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsResumeOpen(false)}
          className="fixed inset-0 bg-plum-950/80 backdrop-blur-sm -z-10"
        />

        {/* Modal Window Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-3xl bg-ivory-50 border-3 border-plum-900 rounded-card-lg shadow-card-xl overflow-hidden max-h-[94vh] flex flex-col"
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-bordeaux-800 text-ivory-100 border-b-2 border-plum-900 no-print">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-butter-300 text-plum-900 px-2 py-0.5 rounded">
                RESUME DOSSIER
              </span>
              <span className="font-mono text-xs text-ivory-200 hidden sm:inline">
                Siri Billakanti — Curriculum Vitae
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-bordeaux-900 hover:bg-plum-900 text-ivory-100 text-xs font-mono rounded border border-ivory-100/30 transition-colors"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-butter-300 hover:bg-butter-400 text-plum-900 text-xs font-mono font-bold rounded border border-plum-900 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={() => setIsResumeOpen(false)}
                className="p-1.5 rounded-lg bg-bordeaux-900/60 hover:bg-plum-900 text-ivory-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Resume Document Sheet */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-10 space-y-7 bg-ivory-50 font-sans text-plum-900 print:p-0">
            {/* Resume Header */}
            <div className="border-b-2 border-plum-900 pb-5">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bordeaux-800 tracking-tight">
                    {profile.name}
                  </h1>
                  <p className="font-mono text-sm font-semibold text-raspberry-600 mt-0.5">
                    {profile.role}
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-plum-700 space-y-1">
                  <div>{profile.email}</div>
                  <div>github.com/siribillakanti</div>
                  <div>linkedin.com/in/siri-billakanti</div>
                  <div>{profile.location}</div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-bordeaux-800 uppercase tracking-widest border-b border-plum-900/20 pb-1">
                EDUCATION
              </h2>
              <div className="flex justify-between items-baseline flex-wrap">
                <div>
                  <span className="font-serif font-bold text-base text-plum-900">
                    {profile.education.degree}
                  </span>
                  <div className="font-mono text-xs text-plum-700">
                    {profile.education.institution} • {profile.education.focus}
                  </div>
                </div>
                <span className="font-mono text-xs text-raspberry-600 font-bold">
                  {profile.education.period}
                </span>
              </div>
              <div className="text-xs font-sans text-plum-800 pt-1">
                <strong>Relevant Coursework:</strong> {profile.education.coursework.join(', ')}
              </div>
            </div>

            {/* Selected Systems & Software Engineering Projects */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold text-bordeaux-800 uppercase tracking-widest border-b border-plum-900/20 pb-1">
                FEATURED PROJECTS
              </h2>

              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-serif font-bold text-base text-bordeaux-800">
                      {p.title} <span className="font-mono text-xs text-plum-600 font-normal">| {p.subtitle}</span>
                    </span>
                    <span className="font-mono text-[11px] text-plum-500">
                      {p.technologies.slice(0, 4).join(', ')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-plum-800 leading-relaxed">
                    {p.description}
                  </p>
                  <ul className="list-disc list-inside text-xs text-plum-800 space-y-0.5">
                    {p.features.slice(0, 2).map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-bordeaux-800 uppercase tracking-widest border-b border-plum-900/20 pb-1">
                TECHNICAL SKILLS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                <div>
                  <strong>Languages:</strong> Python, Java, C/C++, TypeScript, JavaScript, Go, SQL
                </div>
                <div>
                  <strong>Frontend:</strong> React 18, Next.js, Tailwind CSS, Framer Motion, HTML5 Canvas
                </div>
                <div>
                  <strong>Backend & DBs:</strong> Node.js, FastAPI, PostgreSQL, Supabase, Redis, WebSockets
                </div>
                <div>
                  <strong>AI & Vision:</strong> OpenCV, MediaPipe Hands/Pose, PyTorch, Gemini API, Scikit-learn
                </div>
              </div>
            </div>

            {/* Honors & Certifications */}
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-bordeaux-800 uppercase tracking-widest border-b border-plum-900/20 pb-1">
                HONORS & CERTIFICATIONS
              </h2>
              <div className="space-y-1.5 text-xs">
                {certifications.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex justify-between">
                    <span><strong>{c.title}</strong> — {c.issuer}</span>
                    <span className="font-mono text-plum-600">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
