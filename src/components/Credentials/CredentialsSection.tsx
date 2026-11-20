import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Award, ShieldCheck, ExternalLink, Calendar, Trophy, Bookmark } from 'lucide-react';
import { StickerLayer } from '../Common/StickerLayer';

export const CredentialsSection: React.FC = () => {
  const { certifications, achievements, setSelectedCert, sectionsContent } = usePortfolio();
  const sec = sectionsContent.credentials;

  return (
    <section id="credentials" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-visible">
      {/* Visual Customizer Stickers */}
      <StickerLayer pageId="credentials" />
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bordeaux-800 tracking-tight">
          {sec?.title || 'Certifications & Achievements'}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Certifications Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-plum-900/15">
            <h3 className="font-serif text-xl font-bold text-bordeaux-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-bordeaux-800" />
              Certifications
            </h3>
            <span className="font-mono text-xs text-plum-500">
              {certifications.length} Credentials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-card p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-raspberry-600 font-bold mb-1.5">
                    <span className="px-1.5 py-0.5 bg-raspberry-100 rounded border border-raspberry-300">
                      {cert.category}
                    </span>
                    <span className="text-plum-500">{cert.date}</span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-bold text-bordeaux-800 group-hover:text-raspberry-600 transition-colors leading-snug mb-1">
                    {cert.title}
                  </h4>

                  <p className="font-mono text-xs text-plum-700 mb-3">
                    {cert.issuer}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-1.5 py-0.5 bg-ivory-200 border border-plum-900/20 text-plum-800 text-[10px] font-mono rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-plum-900/10 flex items-center justify-between text-[11px] font-mono text-bordeaux-800 font-semibold">
                    <span>ID: {cert.credentialId || 'VERIFIED'}</span>
                    <span className="group-hover:underline flex items-center gap-1">
                      Inspect Certificate →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Achievements & Distinctions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-plum-900/15">
            <h3 className="font-serif text-xl font-bold text-bordeaux-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-bordeaux-800" />
              Achievements & Distinctions
            </h3>
            <span className="font-mono text-xs text-plum-500">
              {achievements.length} Honors
            </span>
          </div>

          <div className="space-y-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-ivory-50 border-2 border-plum-900 rounded-card p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all relative overflow-hidden"
              >
                {/* Accent Top Ribbon */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: ach.badgeColor }}
                />

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-serif text-lg font-bold text-bordeaux-800">
                    {ach.title}
                  </h4>
                  <span className="px-2 py-0.5 bg-butter-300 rounded font-mono text-[10px] font-bold text-plum-900 border border-plum-900/20 whitespace-nowrap">
                    {ach.date}
                  </span>
                </div>

                <div className="font-mono text-xs font-semibold text-raspberry-600 mb-2">
                  {ach.event}
                </div>

                <p className="font-sans text-xs sm:text-sm text-plum-800 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
