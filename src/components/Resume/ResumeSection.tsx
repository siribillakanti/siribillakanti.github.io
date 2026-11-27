import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Download, Eye, CheckCircle2 } from 'lucide-react';

export const ResumeSection: React.FC = () => {
  const { setIsResumeOpen, sectionsContent, profile, showToast } = usePortfolio();
  const sec = sectionsContent.resume;
  const hasCustomResume = Boolean(profile.resumeUrl);

  const handleDownload = () => {
    if (hasCustomResume && profile.resumeUrl) {
      showToast('Resume Download Initiated', `Downloading ${profile.resumeFileName || 'Resume'}...`, 'bordeaux');
      const a = document.createElement('a');
      a.href = profile.resumeUrl;
      a.download = profile.resumeFileName || `${profile.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      setIsResumeOpen(true);
      setTimeout(() => window.print(), 300);
    }
  };

  return (
    <section id="resume" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 sm:p-10 shadow-card-lg relative overflow-hidden">
        {/* Background Decorative Paper Accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-butter-300/40 rounded-bl-full -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-bordeaux-800">
              {sec?.title || 'Resume'}
            </h3>

            {sec?.subtitle && (
              <p className="font-mono text-xs sm:text-sm font-semibold text-raspberry-600">
                {sec.subtitle}
              </p>
            )}

            <p className="font-sans text-sm sm:text-base text-plum-700 leading-relaxed">
              {sec?.description || 'Academic background, coursework, engineering experience, and technical project references.'}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs font-mono text-plum-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-bordeaux-800" />
                {hasCustomResume
                  ? `Custom Resume Attached (${profile.resumeFileName || 'PDF'})`
                  : 'Updated for 2026 Recruitment'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-bordeaux-800" />
                {hasCustomResume
                  ? `Uploaded ${profile.resumeUploadDate || 'Recently'}`
                  : 'Print-ready / Save as PDF'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsResumeOpen(true)}
              className="flex items-center justify-center space-x-2 px-5 py-3 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-sm rounded-xl border-2 border-plum-900 shadow-card hover:shadow-card-hover transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <Eye className="w-4 h-4 text-butter-300" />
              <span>{hasCustomResume ? 'View Uploaded Resume' : 'View Full Resume'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center space-x-2 px-5 py-3 bg-butter-300 hover:bg-butter-400 text-plum-900 font-sans font-bold text-sm rounded-xl border-2 border-plum-900 shadow-card hover:shadow-card-hover transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download className="w-4 h-4 text-plum-900" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
