import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectCard } from './ProjectCard';
import { Sparkles, Layers } from 'lucide-react';
import { StickerLayer } from '../Common/StickerLayer';

export const ProjectsSection: React.FC = () => {
  const { projects, setSelectedProject, sectionsContent } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'AI & Machine Learning',
    'Computer Vision & Interaction',
    'Full Stack Web Development',
    'Cloud & Distributed Systems',
    'Creative Technology & Games',
    'Developer Tools & Productivity',
    'IoT & Embedded Systems',
    'Algorithms & Data Structures',
  ];

  // Also match legacy categories for backward compatibility
  const matchCategory = (projCat: string, filterCat: string) => {
    if (filterCat === 'All') return true;
    if (projCat === filterCat) return true;
    // Legacy mappings
    const legacyMap: Record<string, string> = {
      'Computer Vision & AI': 'Computer Vision & Interaction',
      'Full Stack Web': 'Full Stack Web Development',
      'Distributed Systems & Tools': 'Cloud & Distributed Systems',
      'Creative Tech': 'Creative Technology & Games',
    };
    return legacyMap[projCat] === filterCat;
  };

  const filteredProjects = projects.filter((p) => {
    if (!p.published) return false;
    return matchCategory(p.category, selectedCategory);
  });

  // Only show category pills that have at least one project
  const activeCategories = categories.filter((cat) => {
    if (cat === 'All') return true;
    return projects.some((p) => p.published && matchCategory(p.category, cat));
  });

  const sec = sectionsContent.work;

  return (
    <section id="work" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-visible">
      {/* Visual Customizer Stickers */}
      <StickerLayer pageId="projects" />
      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-plum-900/15 pb-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bordeaux-800 tracking-tight">
              {sec?.title || 'Projects'}
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

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border-2 border-plum-900 shadow-sm active:translate-x-0.5 active:translate-y-0.5 ${
                  selectedCategory === cat
                    ? 'bg-bordeaux-800 text-ivory-100 font-bold shadow-card'
                    : 'bg-ivory-50 text-plum-800 hover:bg-butter-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid with Layered Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((project) => (
          <div key={project.id} className="h-full">
            <ProjectCard
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          </div>
        ))}
      </div>

      {/* Exhibition Footnote Banner */}
      <div className="mt-14 p-6 bg-butter-300/40 border-2 border-dashed border-plum-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-butter-400 rounded-xl border border-plum-900 shadow-sm">
            <Layers className="w-5 h-5 text-bordeaux-800" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-bordeaux-800">
              Looking for architecture deep-dives or custom benchmarks?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-plum-700">
              Each repository includes thorough benchmark notes, setup guides, and reproducible tests.
            </p>
          </div>
        </div>

        <a
          href="https://github.com/siribillakanti"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-plum-900 hover:bg-plum-800 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-card whitespace-nowrap"
        >
          Explore All on GitHub →
        </a>
      </div>
    </section>
  );
};
