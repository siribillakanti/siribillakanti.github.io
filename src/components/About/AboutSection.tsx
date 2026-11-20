import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, GraduationCap, Code2, Compass, Heart, BookOpen, Terminal, Coffee } from 'lucide-react';
import { StickerLayer } from '../Common/StickerLayer';

export const AboutSection: React.FC = () => {
  const { profile, sectionsContent } = usePortfolio();
  const [activeDossier, setActiveDossier] = useState<'philosophy' | 'education' | 'curiosities'>('philosophy');
  const sec = sectionsContent.about;

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-visible">
      {/* Visual Customizer Stickers */}
      <StickerLayer pageId="about" />
      {/* Section Header */}
      <div className="mb-10 sm:mb-14">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bordeaux-800 tracking-tight">
          {sec?.title || 'About Me'}
        </h2>
        {sec?.subtitle && (
          <p className="font-mono text-xs sm:text-sm font-semibold text-raspberry-600 mt-1">
            {sec.subtitle}
          </p>
        )}
        {sec?.description && (
          <p className="font-sans text-sm sm:text-base text-plum-700 mt-2 max-w-2xl leading-relaxed">
            {sec.description}
          </p>
        )}
      </div>

      {/* Editorial Collage Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tactile Photo / Portrait Card with Tape Accent (5 Cols) */}
        <div className="lg:col-span-5 relative">
          {/* Decorative Washi Tape Strips */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-butter-300/80 border border-plum-900/30 -rotate-3 z-20 shadow-sm backdrop-blur-sm pointer-events-none" />
          <div className="absolute -bottom-2 right-4 w-20 h-6 bg-pistachio-300/80 border border-plum-900/30 rotate-6 z-20 shadow-sm backdrop-blur-sm pointer-events-none" />

          {/* Portrait Collage Frame */}
          <div className="relative bg-ivory-50 border-3 border-plum-900 rounded-card p-4 sm:p-5 shadow-card-lg rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
            {/* Illustrated Portrait / Studio Frame */}
            <div className="relative w-full aspect-[4/5] bg-plum-900 rounded-xl overflow-hidden border-2 border-plum-900 flex flex-col justify-between p-5 text-ivory-100">
              {/* Top Frame Stamp */}
              <div className="flex justify-between items-center text-[11px] font-mono text-butter-300 border-b border-plum-800 pb-2.5">
                <span className="font-bold">{profile.name}</span>
                <span>CS 2026</span>
              </div>

              {/* Artistic Photo / Representation */}
              <div className="relative my-auto flex flex-col items-center justify-center text-center py-2">
                {(() => {
                  const shapeClass =
                    profile.photoFrameShape === 'square'
                      ? 'rounded-lg'
                      : profile.photoFrameShape === 'circle'
                      ? 'rounded-full'
                      : 'rounded-2xl';

                  const posClass =
                    profile.photoPosition === 'top'
                      ? 'object-top'
                      : profile.photoPosition === 'bottom'
                      ? 'object-bottom'
                      : 'object-center';

                  return (
                    <div
                      className={`relative w-44 h-44 sm:w-48 sm:h-48 ${shapeClass} bg-bordeaux-800 border-3 border-butter-400 p-1 shadow-card flex items-center justify-center overflow-hidden mb-3.5 transition-all`}
                    >
                      {profile.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt={profile.name}
                          className={`w-full h-full object-cover ${posClass} ${shapeClass}`}
                        />
                      ) : (
                        /* Stylized Avatar Illustration */
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Head */}
                          <circle cx="50" cy="45" r="22" fill="#F4EEDC" stroke="#2A102A" strokeWidth="2" />
                          {/* Hair */}
                          <path
                            d="M26 44 C 26 22, 74 22, 74 44 C 74 34, 66 26, 50 26 C 34 26, 26 34, 26 44 Z"
                            fill="#2A102A"
                          />
                          <path
                            d="M26 44 C 24 55, 26 70, 32 75 C 28 65, 28 50, 30 44 Z"
                            fill="#2A102A"
                          />
                          <path
                            d="M74 44 C 76 55, 74 70, 68 75 C 72 65, 72 50, 70 44 Z"
                            fill="#2A102A"
                          />
                          {/* Glasses */}
                          <rect x="36" y="40" width="12" height="9" rx="2" fill="none" stroke="#5C1327" strokeWidth="2" />
                          <rect x="52" y="40" width="12" height="9" rx="2" fill="none" stroke="#5C1327" strokeWidth="2" />
                          <line x1="48" y1="44" x2="52" y2="44" stroke="#5C1327" strokeWidth="2" />
                          {/* Smile */}
                          <path d="M44 54 Q 50 58 56 54" stroke="#5C1327" strokeWidth="2" strokeLinecap="round" fill="none" />
                          {/* Body */}
                          <path d="M22 95 C 25 72, 75 72, 78 95 Z" fill="#C72C61" stroke="#2A102A" strokeWidth="2" />
                        </svg>
                      )}
                    </div>
                  );
                })()}

                <h3 className="font-serif text-2xl font-bold text-butter-300">
                  {profile.name}
                </h3>
                <p className="font-mono text-xs text-ivory-300 mt-0.5">
                  {profile.role}
                </p>
              </div>

              {/* Bottom Card Credentials Tag */}
              <div className="pt-2.5 border-t border-plum-800 flex justify-between items-center text-[10px] font-mono text-pistachio-300">
                <span>📍 {profile.location}</span>
                <span>{profile.availability}</span>
              </div>
            </div>

            {/* Handwritten-style caption below photo */}
            <div className="mt-3 text-center">
              <p className="font-serif italic text-sm text-plum-800">
                "Writing clean algorithms by day, designing playful interfaces by night."
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Layered Editorial Dossier Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Dossier Navigation Tabs */}
          <div className="flex space-x-2 border-b-2 border-plum-900/20 pb-2">
            <button
              onClick={() => setActiveDossier('philosophy')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all border-2 ${
                activeDossier === 'philosophy'
                  ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-card'
                  : 'bg-ivory-50 text-plum-800 border-transparent hover:bg-butter-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Engineering Philosophy</span>
            </button>

            <button
              onClick={() => setActiveDossier('education')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all border-2 ${
                activeDossier === 'education'
                  ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-card'
                  : 'bg-ivory-50 text-plum-800 border-transparent hover:bg-butter-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Foundation</span>
            </button>

            <button
              onClick={() => setActiveDossier('curiosities')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all border-2 ${
                activeDossier === 'curiosities'
                  ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-card'
                  : 'bg-ivory-50 text-plum-800 border-transparent hover:bg-butter-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Interests & Pursuits</span>
            </button>
          </div>

          {/* Dossier Content Card */}
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card p-6 sm:p-8 shadow-card space-y-6">
            {activeDossier === 'philosophy' && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                  Where Rigor Meets Tactile Play
                </h3>
                <p className="font-sans text-sm sm:text-base text-plum-900 leading-relaxed">
                  I believe software is most powerful when it bridges invisible systems complexity with tangible, immediate responsiveness. A distributed data pipeline that synchronizes thousands of events per second should feel as seamless and tactile as turning a physical dial.
                </p>
                <p className="font-sans text-sm sm:text-base text-plum-900 leading-relaxed">
                  In projects like <strong className="text-bordeaux-800">GesturePac</strong> and <strong className="text-cobalt-600">GestureStudio</strong>, I explored how computer vision can break through glass boundaries to translate human kinetic intuition into software control. In <strong className="text-bordeaux-800">Vaultly</strong> and <strong className="text-raspberry-600">InventoryOS</strong>, I engineered cryptographic guarantees and concurrency controls that protect sensitive user trust without sacrificing velocity.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-butter-300/40 rounded-xl border border-plum-900/15">
                    <span className="font-mono text-xs font-bold text-bordeaux-800 block mb-1">
                      HIGH-THROUGHPUT RELIABILITY
                    </span>
                    <span className="text-xs text-plum-800 leading-normal">
                      Obsessed with sub-50ms latency, race condition prevention, and fault isolation.
                    </span>
                  </div>

                  <div className="p-3 bg-pistachio-300/40 rounded-xl border border-plum-900/15">
                    <span className="font-mono text-xs font-bold text-bordeaux-800 block mb-1">
                      KINETIC & TACTILE DESIGN
                    </span>
                    <span className="text-xs text-plum-800 leading-normal">
                      Every button click, keypress, and gesture trigger should have intentional physics and purpose.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeDossier === 'education' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between flex-wrap gap-1">
                    <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                      {profile.education.degree}
                    </h3>
                    <span className="font-mono text-xs text-plum-600 font-bold bg-butter-300 px-2 py-0.5 rounded border border-plum-900/20">
                      {profile.education.period}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-raspberry-600 font-semibold mt-0.5">
                    {profile.education.institution} • {profile.education.focus}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="font-mono text-xs font-bold text-plum-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-bordeaux-800" />
                    Core Coursework & Competencies
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {profile.education.coursework.map((course, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 p-2 bg-ivory-100 rounded border border-plum-900/10 text-xs font-mono text-plum-900"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-bordeaux-800 flex-shrink-0"></span>
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDossier === 'curiosities' && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                  Explorations & Creative Sparks
                </h3>
                <p className="font-sans text-sm sm:text-base text-plum-900 leading-relaxed">
                  When not writing code or debugging memory allocations, I immerse myself in creative and analytical pursuits that feed back into my engineering practice:
                </p>

                <div className="space-y-2.5">
                  {profile.interests.map((interest, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-ivory-100 rounded-xl border border-plum-900/15 flex items-center space-x-3"
                    >
                      <span className="text-base">✨</span>
                      <span className="font-sans text-sm font-semibold text-plum-900">
                        {interest}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
