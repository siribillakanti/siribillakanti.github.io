import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { SectionContentConfig, SectionHeadingItem } from '../../../types/portfolio';
import { Type, FolderKanban, User, Sparkles, Award, FileText, Mail, Check } from 'lucide-react';

export const SectionsEditor: React.FC = () => {
  const { sectionsContent, updateSectionContent, showToast } = usePortfolio();
  const [activeSection, setActiveSection] = useState<keyof SectionContentConfig>('work');

  const sectionsList: { id: keyof SectionContentConfig; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'work', label: 'Projects Exhibition', icon: FolderKanban },
    { id: 'about', label: 'About Me', icon: User },
    { id: 'stack', label: 'Tech Stack & Tools', icon: Sparkles },
    { id: 'credentials', label: 'Certifications & Honors', icon: Award },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'contact', label: 'Contact & Dispatch', icon: Mail },
  ];

  const currentItem: SectionHeadingItem = sectionsContent[activeSection] || {
    title: '',
    subtitle: '',
    description: '',
  };

  const handleFieldChange = (field: keyof SectionHeadingItem, val: string) => {
    updateSectionContent({
      ...sectionsContent,
      [activeSection]: {
        ...currentItem,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header Overview */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Section Headings & Editorial Descriptions
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Customize the titles, subtitles, descriptions, and supporting copy across each section of your public portfolio.
            </p>
          </div>
        </div>

        {/* Section Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-sm'
                    : 'bg-ivory-100 text-plum-800 border-plum-900/20 hover:bg-butter-300/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-butter-300' : 'text-bordeaux-800'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Form for Active Section */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-plum-900/15 pb-3">
          <h4 className="font-serif text-xl font-bold text-bordeaux-800">
            Editing: {sectionsList.find((s) => s.id === activeSection)?.label}
          </h4>
          <span className="font-mono text-xs text-plum-500">
            ID: #{activeSection}
          </span>
        </div>

        <div className="space-y-4">
          {/* Main Title */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Primary Section Heading (H2) *
            </label>
            <input
              type="text"
              value={currentItem.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Projects"
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-serif text-lg font-bold text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
            />
            <span className="text-[11px] font-mono text-plum-500">
              The prominent serif heading rendered at the top of the section.
            </span>
          </div>

          {/* Subtitle / Topic Lead */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Section Subtitle / Topic Lead
            </label>
            <input
              type="text"
              value={currentItem.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              placeholder="e.g. Exhibition of technical systems and software craft"
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
            />
          </div>

          {/* Description Paragraph */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Detailed Description & Framing Note
            </label>
            <textarea
              rows={3}
              value={currentItem.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Add contextual framing for this section..."
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm resize-none"
            />
          </div>
        </div>

        {/* Live Typography Preview Callout */}
        <div className="p-5 bg-ivory-200/70 rounded-2xl border border-plum-900/15 space-y-2">
          <span className="font-mono text-[10px] text-plum-500 uppercase tracking-widest block font-bold">
            LIVE SECTION PREVIEW
          </span>
          <h2 className="font-serif text-3xl font-bold text-bordeaux-800 tracking-tight">
            {currentItem.title || 'Untitled Section'}
          </h2>
          {currentItem.subtitle && (
            <p className="font-mono text-xs font-semibold text-raspberry-600">
              {currentItem.subtitle}
            </p>
          )}
          {currentItem.description && (
            <p className="font-sans text-sm text-plum-700 max-w-2xl leading-relaxed">
              {currentItem.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
