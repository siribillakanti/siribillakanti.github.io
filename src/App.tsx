import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { GrainOverlay } from './components/Common/GrainOverlay';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/Hero/HeroSection';
import { ProjectsSection } from './components/Projects/ProjectsSection';
import { AboutSection } from './components/About/AboutSection';
import { SkillsSection } from './components/Skills/SkillsSection';
import { CredentialsSection } from './components/Credentials/CredentialsSection';
import { ResumeSection } from './components/Resume/ResumeSection';
import { ContactSection } from './components/Contact/ContactSection';
import { ProjectModal } from './components/Projects/ProjectModal';
import { ResumeModal } from './components/Resume/ResumeModal';
import { CertModal } from './components/Credentials/CertModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ToastContainer } from './components/Common/Toast';
import { CustomCursor } from './components/Common/CustomCursor';
import { BrandLogo } from './components/Common/BrandLogo';

const PortfolioContent: React.FC = () => {
  const { isInitialLoading, selectedProject, setSelectedProject, setIsResumeOpen } = usePortfolio();

  // Handle direct navigation to resume via hash (#resume) or path (/resume)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#resume' || path.endsWith('/resume')) {
        setIsResumeOpen(true);
      }
    };
    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    return () => window.removeEventListener('hashchange', handleUrlRoute);
  }, [setIsResumeOpen]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center font-sans text-plum-900 select-none">
        <GrainOverlay />
        <div className="flex flex-col items-center space-y-4 p-8 text-center">
          <BrandLogo size={56} />
          <div>
            <h1 className="font-serif text-2xl font-bold text-bordeaux-800">Siri Billakanti</h1>
            <p className="font-mono text-xs text-plum-600 mt-1 uppercase tracking-widest font-semibold">
              Loading Portfolio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleExploreClick = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-public relative min-h-screen bg-ivory-100 text-plum-900 font-sans selection:bg-butter-400 selection:text-plum-900 overflow-x-hidden">
      {/* Subtle paper grain texture */}
      <GrainOverlay />

      {/* Custom interactive cursor (desktop only) */}
      <CustomCursor />

      {/* Floating Pill Navigation */}
      <Navigation />

      {/* Main Single Page Scroll Journey */}
      <main>
        {/* Section 1: Hero Profile Card & Miniature Illustrated Objects */}
        <HeroSection onExploreClick={handleExploreClick} />

        {/* Section 2: Project Exhibition */}
        <ProjectsSection />

        {/* Section 3: About Me Editorial Collage */}
        <AboutSection />

        {/* Section 4: Skills & Technical Arsenal */}
        <SkillsSection />

        {/* Section 5: Credentials & Achievements */}
        <CredentialsSection />

        {/* Section 6: Curriculum Vitae & Resume Preview */}
        <ResumeSection />

        {/* Section 7: Dispatch & Correspondence */}
        <ContactSection />
      </main>

      {/* Modals & Portals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <ResumeModal />
      <CertModal />
      <AdminDashboard />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <PortfolioContent />
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
