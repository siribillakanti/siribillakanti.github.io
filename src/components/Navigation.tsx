import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Lock, Menu, X } from 'lucide-react';
import { BrandLogo } from './Common/BrandLogo';

export const Navigation: React.FC = () => {
  const { setIsResumeOpen, isAdminAuthenticated, setIsAdminOpen, branding } = usePortfolio();
  const { isAdmin, isSupabaseActive } = useAuth();
  const isAuthenticated = isSupabaseActive ? isAdmin : isAdminAuthenticated;
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'stack', label: 'Stack' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'work', 'about', 'stack', 'credentials', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-ivory-50/95 backdrop-blur-md border-2 border-plum-900 rounded-full px-3.5 sm:px-5 py-2 shadow-card flex items-center justify-between gap-3 sm:gap-6 max-w-2xl w-auto">
        {/* Logo / Initials */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center space-x-2 font-serif font-black text-bordeaux-800 text-base sm:text-lg tracking-tight hover:text-raspberry-600 transition-colors"
          title={branding.websiteTitle}
        >
          <BrandLogo size={28} />
          <span className="hidden xs:inline">{branding.websiteTitle || 'Siri Billakanti'}</span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-1 text-xs font-mono">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-bordeaux-800 text-ivory-100 font-bold shadow-sm'
                    : 'text-plum-800 hover:text-bordeaux-800 hover:bg-ivory-200'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Resume & Admin */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setIsResumeOpen(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-butter-300 hover:bg-butter-400 text-plum-900 text-xs font-mono font-bold rounded-full border border-plum-900 shadow-sm transition-transform active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-plum-900" />
            <span>Resume</span>
          </button>

          {/* Admin Button - Accessible on both desktop and mobile */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 text-xs font-mono rounded-full border border-plum-900/40 transition-all active:scale-95 shadow-sm ${
              isAuthenticated
                ? 'bg-pistachio-300 text-plum-900 border-plum-900 font-bold'
                : 'bg-ivory-100 hover:bg-ivory-200 text-plum-800 hover:text-bordeaux-800'
            }`}
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Lock className="w-3.5 h-3.5 text-bordeaux-800" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-1 text-plum-900 hover:text-bordeaux-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {isMobileOpen && (
        <div className="pointer-events-auto absolute top-16 left-4 right-4 bg-ivory-50 border-2 border-plum-900 rounded-2xl p-4 shadow-card-lg md:hidden flex flex-col space-y-2 font-mono text-sm">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-left px-3 py-2 rounded-lg text-plum-900 hover:bg-butter-300 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setIsMobileOpen(false);
              setIsResumeOpen(true);
            }}
            className="text-left px-3 py-2 rounded-lg bg-butter-300 text-plum-900 font-bold"
          >
            Resume
          </button>
          <button
            onClick={() => {
              setIsMobileOpen(false);
              setIsAdminOpen(true);
            }}
            className="flex items-center space-x-2 text-left px-3 py-2 rounded-lg text-plum-900 hover:bg-ivory-200 transition-colors border-t border-plum-900/15 pt-3"
          >
            <Lock className="w-4 h-4 text-bordeaux-800" />
            <span>Admin Portal</span>
          </button>
        </div>
      )}
    </header>
  );
};
