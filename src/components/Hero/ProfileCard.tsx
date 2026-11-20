import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ArrowDownRight, 
  FileText, 
  Mail, 
  Github, 
  Linkedin, 
  ChevronDown, 
  ChevronUp,
  Check, 
  Compass, 
  Terminal,
  BookOpen,
  GraduationCap,
  Heart
} from 'lucide-react';

interface ProfileCardProps {
  onExploreClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ onExploreClick }) => {
  const { profile, setIsResumeOpen, showToast } = usePortfolio();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -3.8;
    const rY = ((x - centerX) / centerX) * 3.8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const copyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    showToast('Email Copied!', profile.email, 'bordeaux');
    setTimeout(() => setCopied(false), 2500);
  };

  const primaryBtnLabel = profile.heroCardConfig?.primaryButtonLabel || 'Explore Projects';
  const secondaryBtnLabel = profile.heroCardConfig?.secondaryButtonLabel || 'Inspect Resume';
  const invitationMsg = profile.heroCardConfig?.invitationText || 'Computer Science student & creative developer';

  const handlePrimaryClick = () => {
    const dest = profile.heroCardConfig?.primaryButtonDestination || 'work';
    if (dest.startsWith('http://') || dest.startsWith('https://')) {
      window.open(dest, '_blank');
    } else {
      const el = document.getElementById(dest.replace(/^#/, ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onExploreClick();
      }
    }
  };

  const handleSecondaryClick = () => {
    const dest = profile.heroCardConfig?.secondaryButtonDestination || 'resume';
    if (dest === 'resume' || dest === 'modal') {
      setIsResumeOpen(true);
    } else if (dest.startsWith('http://') || dest.startsWith('https://')) {
      window.open(dest, '_blank');
    } else {
      const el = document.getElementById(dest.replace(/^#/, ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setIsResumeOpen(true);
      }
    }
  };

  // Photo frame shape class based on CMS setting
  const frameShapeClass = (() => {
    const shape = profile.photoFrameShape || 'rounded';
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'square') return 'rounded-2xl';
    return 'rounded-3xl';
  })();

  const photoPosClass = (() => {
    const pos = profile.photoPosition || 'center';
    if (pos === 'top') return 'object-top';
    if (pos === 'bottom') return 'object-bottom';
    return 'object-center';
  })();

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      transition={{ type: 'spring', damping: 22, stiffness: 200, mass: 0.5 }}
      className="relative z-10 w-full max-w-[640px] mx-auto select-none"
    >
      {/* Decorative Layered Card Shadow & Paper Stack Effect */}
      <div className="absolute inset-0 bg-bordeaux-900 rounded-card-lg translate-x-3 translate-y-3 -z-10 transition-transform duration-300" />
      <div className="absolute inset-0 bg-butter-400 rounded-card-lg translate-x-1.5 translate-y-1.5 -z-10 opacity-80" />

      {/* Main Physical Card Container */}
      <div className="relative bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-7 sm:p-9 md:p-10 shadow-card-xl transition-all duration-300 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-plum-900/15 pb-4 mb-6">
          {/* Availability Indicator */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 bg-pistachio-300/40 border border-pistachio-600 rounded-full shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              {profile.availabilityStatus !== 'busy' && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  profile.availabilityStatus === 'exploring' ? 'bg-amber-500' : 'bg-pistachio-600'
                }`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                profile.availabilityStatus === 'busy' 
                  ? 'bg-red-500' 
                  : profile.availabilityStatus === 'exploring' 
                  ? 'bg-amber-500' 
                  : 'bg-pistachio-600'
              }`}></span>
            </span>
            <span className="text-xs sm:text-sm font-mono font-medium text-plum-900 tracking-tight">
              {profile.availability}
            </span>
          </div>

          {/* Location Badge */}
          {profile.location && (
            <span className="text-xs font-mono font-medium text-plum-700 bg-ivory-200/90 px-2.5 py-1 rounded-md border border-plum-900/15">
              📍 {profile.location}
            </span>
          )}
        </div>

        {/* Profile Identity Heading */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[50px] font-bold text-bordeaux-800 tracking-tight leading-[1.1]">
              {profile.name}
            </h1>
          </div>

          <p className="font-mono text-sm sm:text-base font-semibold text-raspberry-600 tracking-normal flex items-center gap-2">
            <Terminal className="w-4 h-4 text-raspberry-600 inline flex-shrink-0" />
            <span>{profile.role}</span>
          </p>
        </div>

        {/* Introduction Snippet */}
        <p className="font-sans text-base sm:text-lg text-plum-900 leading-relaxed mb-7 font-normal">
          {profile.shortBio}
        </p>

        {/* Expandable Extended Profile Experience */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t-2 border-dashed border-plum-900/20 pt-6 mb-7"
            >
              <div className="bg-ivory-200/70 border-2 border-plum-900/15 rounded-2xl p-5 sm:p-7 shadow-inner space-y-6">
                
                {/* Header of Expanded Area with Collapse Button */}
                <div className="flex items-center justify-between border-b border-plum-900/15 pb-3">
                  <div className="flex items-center space-x-2 text-bordeaux-800 font-serif font-bold text-lg sm:text-xl">
                    <BookOpen className="w-5 h-5 text-bordeaux-800" />
                    <span>Personal Profile & Background</span>
                  </div>

                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-ivory-100 hover:bg-butter-300 text-plum-800 text-xs font-mono font-bold rounded-lg border border-plum-900/30 transition-colors shadow-sm"
                  >
                    <span>Collapse</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Portrait Photography & Bio Grid */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Noticeably Larger Photograph Frame */}
                  <div className="flex-shrink-0 text-center">
                    <div 
                      className={`relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 border-3 border-plum-900 overflow-hidden shadow-card bg-plum-900 flex items-center justify-center ${frameShapeClass}`}
                    >
                      {profile.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt={profile.name}
                          className={`w-full h-full object-cover ${photoPosClass} ${frameShapeClass}`}
                        />
                      ) : (
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="45" r="22" fill="#F4EEDC" stroke="#2A102A" strokeWidth="2" />
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
                          <rect x="36" y="40" width="12" height="9" rx="2" fill="none" stroke="#5C1327" strokeWidth="2" />
                          <rect x="52" y="40" width="12" height="9" rx="2" fill="none" stroke="#5C1327" strokeWidth="2" />
                          <line x1="48" y1="44" x2="52" y2="44" stroke="#5C1327" strokeWidth="2" />
                          <path d="M44 54 Q 50 58 56 54" stroke="#5C1327" strokeWidth="2" strokeLinecap="round" fill="none" />
                          <path d="M22 95 C 25 72, 75 72, 78 95 Z" fill="#C72C61" stroke="#2A102A" strokeWidth="2" />
                        </svg>
                      )}
                    </div>
                    <span className="inline-block mt-2 font-mono text-[11px] text-plum-600 font-semibold">
                      {profile.name}
                    </span>
                  </div>

                  {/* Editorial Biography Text */}
                  <div className="space-y-3.5 flex-1 text-xs sm:text-sm font-sans text-plum-900 leading-relaxed">
                    {profile.editorialBio.map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Areas of Interest & Passions */}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="pt-2 border-t border-plum-900/10">
                    <span className="font-mono text-xs font-bold text-plum-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-raspberry-600" />
                      Interests & Creative Passions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-ivory-50 border border-plum-900/20 text-plum-900 text-xs font-mono rounded-lg shadow-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Focus & Coursework Highlight */}
                {profile.education && (
                  <div className="pt-2 border-t border-plum-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-plum-700 bg-ivory-100/90 p-3.5 rounded-xl border border-plum-900/10">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-bordeaux-800 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-bordeaux-800">{profile.education.degree}</span>
                        <span className="text-plum-500 block sm:inline sm:ml-1">({profile.education.period})</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-plum-600 sm:text-right">
                      {profile.education.institution}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Action Buttons & Exploratory Controls */}
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Main Primary Action: View Projects */}
            <button
              onClick={handlePrimaryClick}
              className="group relative flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-sm sm:text-base rounded-xl border-2 border-plum-900 shadow-card hover:shadow-card-hover transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Compass className="w-5 h-5 text-butter-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>{primaryBtnLabel}</span>
              <ArrowDownRight className="w-4 h-4 text-ivory-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </button>

            {/* Secondary Action: Inspect Resume */}
            <button
              onClick={handleSecondaryClick}
              className="flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-butter-300 hover:bg-butter-400 text-plum-900 font-sans font-bold text-sm sm:text-base rounded-xl border-2 border-plum-900 shadow-card hover:shadow-card-hover transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5"
            >
              <FileText className="w-4 h-4 text-plum-900" />
              <span>{secondaryBtnLabel}</span>
            </button>
          </div>

          {/* Social Links & Expand Toggle Strip */}
          <div className="flex items-center justify-between pt-2">
            {/* Social Icons */}
            <div className="flex items-center space-x-2.5">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                title="Siri on GitHub"
                className="p-2.5 bg-ivory-200/90 hover:bg-plum-800 hover:text-ivory-100 text-plum-900 rounded-xl border-2 border-plum-900 shadow-sm transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                title="Siri on LinkedIn"
                className="p-2.5 bg-ivory-200/90 hover:bg-cobalt-600 hover:text-ivory-100 text-plum-900 rounded-xl border-2 border-plum-900 shadow-sm transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <button
                onClick={copyEmail}
                title="Copy Email Address"
                className="flex items-center space-x-1.5 px-3 py-2 bg-ivory-200/90 hover:bg-raspberry-500 hover:text-ivory-100 text-plum-900 text-xs font-mono font-medium rounded-xl border-2 border-plum-900 shadow-sm transition-colors duration-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Mail className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>

            {/* Toggle Full Bio Expansion Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs sm:text-sm font-mono font-semibold text-plum-800 hover:text-bordeaux-800 flex items-center space-x-1.5 py-1.5 px-3 rounded-lg hover:bg-butter-300/60 border border-plum-900/20 transition-all shadow-sm"
            >
              <span>{isExpanded ? 'Less' : 'More Bio & Photo'}</span>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Bottom invitation teaser note */}
        <div className="mt-6 pt-3.5 border-t border-plum-900/10 flex items-center justify-between text-xs font-mono text-plum-600">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-raspberry-500"></span>
            {invitationMsg}
          </span>
          <span className="text-plum-400 font-bold">2026</span>
        </div>
      </div>
    </motion.div>
  );
};