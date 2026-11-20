import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types/portfolio';
import { ProjectPreviewGraphic } from './ProjectPreviews';
import { X, Github, ExternalLink, Cpu, CheckCircle2, Layers, Sparkles, Terminal } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture'>('overview');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-plum-950/75 backdrop-blur-sm -z-10"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-2xl bg-ivory-50 border-3 border-plum-900 rounded-card-lg shadow-card-xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b-2 border-plum-900 text-ivory-100"
            style={{ backgroundColor: project.accentColor }}
          >
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-ivory-100 text-plum-900 font-mono text-xs font-bold rounded">
                Project #{String(project.order).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs tracking-wider uppercase text-ivory-200">
                {project.category}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-plum-900/40 hover:bg-plum-900 text-ivory-100 transition-colors border border-ivory-100/30"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
            {/* Visual Preview Graphic */}
            <div className="border-2 border-plum-900 rounded-xl overflow-hidden shadow-card">
              <ProjectPreviewGraphic project={project} />
            </div>

            {/* Title & Tagline */}
            <div>
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bordeaux-800 tracking-tight">
                  {project.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-plum-900 hover:bg-plum-800 text-ivory-100 text-xs font-mono rounded-lg border border-plum-900 shadow-sm transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-butter-300 hover:bg-butter-400 text-plum-900 text-xs font-mono font-bold rounded-lg border border-plum-900 shadow-sm transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              <p className="font-mono text-xs sm:text-sm font-semibold text-raspberry-600 mb-2">
                {project.subtitle}
              </p>

              <p className="font-sans italic text-sm text-plum-700 bg-ivory-200/80 p-3 rounded-lg border border-plum-900/10">
                "{project.tagline}"
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b-2 border-plum-900/20 font-mono text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-4 font-bold border-b-2 -mb-0.5 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-bordeaux-800 text-bordeaux-800'
                    : 'border-transparent text-plum-600 hover:text-plum-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`py-2 px-4 font-bold border-b-2 -mb-0.5 transition-colors ${
                  activeTab === 'features'
                    ? 'border-bordeaux-800 text-bordeaux-800'
                    : 'border-transparent text-plum-600 hover:text-plum-900'
                }`}
              >
                Key Features ({project.features.length})
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`py-2 px-4 font-bold border-b-2 -mb-0.5 transition-colors ${
                  activeTab === 'architecture'
                    ? 'border-bordeaux-800 text-bordeaux-800'
                    : 'border-transparent text-plum-600 hover:text-plum-900'
                }`}
              >
                Architecture & Systems
              </button>
            </div>

            {/* Tab Panes */}
            <div>
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="font-sans text-sm sm:text-base text-plum-900 leading-relaxed">
                    {project.longDescription}
                  </p>

                  <div>
                    <h4 className="font-mono text-xs font-bold text-plum-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-bordeaux-800" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-ivory-200 border-2 border-plum-900/30 text-plum-900 font-mono text-xs rounded-md shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-2.5">
                  {project.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2.5 p-3 bg-ivory-100 rounded-lg border border-plum-900/15"
                    >
                      <CheckCircle2 className="w-4 h-4 text-bordeaux-800 mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-sm text-plum-800 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="space-y-2.5">
                  <div className="bg-plum-900 text-ivory-100 p-4 rounded-xl font-mono text-xs space-y-2 border-2 border-plum-900 shadow-card">
                    <div className="flex items-center space-x-1.5 text-butter-400 pb-1 border-b border-plum-800">
                      <Terminal className="w-4 h-4" />
                      <span className="font-bold">SYSTEM TOPOLOGY & PIPELINE</span>
                    </div>
                    {project.architecture.map((arch, i) => (
                      <div key={i} className="flex items-start space-x-2 text-ivory-200">
                        <span className="text-butter-300 font-bold">[{i + 1}]</span>
                        <span>{arch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-ivory-200 border-t-2 border-plum-900 flex items-center justify-between text-xs font-mono text-plum-600">
            <span>SIRI BILLAKANTI // PORTFOLIO</span>
            <button
              onClick={onClose}
              className="text-bordeaux-800 font-bold hover:underline"
            >
              Back to Gallery
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
