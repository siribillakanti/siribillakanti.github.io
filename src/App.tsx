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

const PortfolioContent: React.FC = () => {
  const { selectedProject, setSelectedProject } = usePortfolio();

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
