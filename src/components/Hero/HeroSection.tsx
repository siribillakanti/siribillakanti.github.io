import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileCard } from './ProfileCard';
import { IllustratedObjects } from './IllustratedObjects';
import { StickerLayer } from '../Common/StickerLayer';
import { usePortfolio } from '../../context/PortfolioContext';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const { setSelectedProject, projects } = usePortfolio();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const x = (e.clientX / clientWidth) * 2 - 1; // -1 to 1
    const y = (e.clientY / clientHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleSelectProject = (projectId: string) => {
    const p = projects.find((item) => item.id === projectId);
    if (p) {
      setSelectedProject(p);
    } else {
      // scroll to projects section
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-12 pt-28 pb-20 overflow-visible"
    >
      {/* Background Subtle Editorial Grid Texture */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#2A102A 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.12,
          }}
        />
      </div>

      {/* Central Content Area with Card & Floating Objects */}
      <div className="relative w-full max-w-2xl sm:max-w-[700px] mx-auto overflow-visible">
        {/* Public Customizer Stickers */}
        <StickerLayer pageId="homepage" mouseX={mousePos.x} mouseY={mousePos.y} />

        {/* Asymmetrical Floating Objects Layer */}
        <IllustratedObjects
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          onSelectProject={handleSelectProject}
        />

        {/* Central Profile Card */}
        <ProfileCard onExploreClick={onExploreClick} />
      </div>

      {/* Subtle Bottom Scroll Cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-plum-600"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-plum-500 mb-1">
          SCROLL TO EXPLORE
        </span>
        <div className="w-4 h-7 border-2 border-plum-900/30 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-plum-800 rounded-full animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};
