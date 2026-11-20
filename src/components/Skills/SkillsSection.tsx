import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Terminal, Layout, Database, Brain, Wrench, Check } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skills, sectionsContent } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const sec = sectionsContent.stack;

  const categories = [
    { id: 'all', label: 'All Technologies', icon: Sparkles },
    { id: 'languages', label: 'Languages', icon: Terminal },
    { id: 'frontend', label: 'Frontend & UI', icon: Layout },
    { id: 'backend', label: 'Backend & DBs', icon: Database },
    { id: 'ai', label: 'AI & Vision', icon: Brain },
    { id: 'tools', label: 'Tools & Platforms', icon: Wrench },
  ];

  const filteredSkills = skills.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  // Group by category for visual clusters
  const categoryTitleMap: Record<string, string> = {
    languages: 'Programming Languages',
    frontend: 'Frontend & Creative Development',
    backend: 'Backend, Distributed Systems & Databases',
    ai: 'Computer Vision & AI/ML',
    tools: 'DevOps, Tooling & Systems',
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'languages':
        return { border: 'border-bordeaux-800', bg: 'bg-bordeaux-800 text-ivory-100', accent: 'bg-butter-300' };
      case 'frontend':
        return { border: 'border-raspberry-500', bg: 'bg-raspberry-500 text-ivory-100', accent: 'bg-ivory-100' };
      case 'backend':
        return { border: 'border-cobalt-600', bg: 'bg-cobalt-600 text-ivory-100', accent: 'bg-butter-400' };
      case 'ai':
        return { border: 'border-plum-800', bg: 'bg-plum-800 text-ivory-100', accent: 'bg-pistachio-300' };
      case 'tools':
      default:
        return { border: 'border-pistachio-600', bg: 'bg-pistachio-600 text-plum-900', accent: 'bg-ivory-100' };
    }
  };

  return (
    <section id="stack" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-plum-900/15 pb-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bordeaux-800 tracking-tight">
              {sec?.title || 'Tech Stack & Tools'}
            </h2>
            {sec?.subtitle && (
              <p className="font-mono text-xs sm:text-sm font-semibold text-raspberry-600 mt-1">
                {sec.subtitle}
              </p>
            )}
            {sec?.description && (
              <p className="font-sans text-sm sm:text-base text-plum-700 mt-2 max-w-xl leading-relaxed">
                {sec.description}
              </p>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border-2 border-plum-900 shadow-sm active:translate-x-0.5 active:translate-y-0.5 ${
                    activeCategory === cat.id
                      ? 'bg-bordeaux-800 text-ivory-100 font-bold shadow-card'
                      : 'bg-ivory-50 text-plum-800 hover:bg-butter-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Sticker-Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredSkills.map((skill, index) => {
          const theme = getCategoryTheme(skill.category);
          return (
            <div
              key={skill.name}
              className={`group relative bg-ivory-50 border-2 border-plum-900 rounded-xl p-3.5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-plum-900 group-hover:text-bordeaux-800 transition-colors">
                  {skill.name}
                </span>
                {skill.badge && (
                  <span className="px-1.5 py-0.5 bg-butter-300 border border-plum-900 rounded text-[9px] font-mono font-bold text-plum-900 tracking-tight">
                    {skill.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-plum-900/10 text-[10px] font-mono text-plum-500">
                <span className="capitalize">{skill.category}</span>
                <span className="w-2 h-2 rounded-full bg-pistachio-500 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all"></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stack Summary Note */}
      <div className="mt-10 p-4 bg-ivory-200/60 rounded-xl border border-plum-900/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-plum-700 gap-3">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-bordeaux-800"></span>
          No arbitrary percentage bars — evaluated by production experience, systems correctness, and design excellence.
        </span>
        <span className="text-plum-500 font-bold">TOTAL TOOLS: {skills.length}</span>
      </div>
    </section>
  );
};
