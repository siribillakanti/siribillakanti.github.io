import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/portfolio';
import { ProjectPreviewGraphic } from './ProjectPreviews';
import { Github, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -4;
    const rY = ((x - centerX) / centerX) * 4;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.6 }}
      className="group relative cursor-pointer flex flex-col h-full bg-ivory-50 border-2 border-plum-900 rounded-card p-0 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Background paper offset accent on hover */}
      <div
        className="absolute inset-0 rounded-card translate-x-2 translate-y-2 -z-10 transition-colors duration-300 opacity-60 group-hover:opacity-100"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Top Graphic Preview Container */}
      <div className="relative border-b-2 border-plum-900 overflow-hidden rounded-t-card">
        <ProjectPreviewGraphic project={project} />

        {/* Category Pill Tag Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 px-2.5 py-1 bg-ivory-50/95 border border-plum-900 rounded-full shadow-sm text-[10px] font-mono font-bold text-plum-900 uppercase tracking-wider backdrop-blur-sm">
          <Sparkles className="w-2.5 h-2.5 text-bordeaux-800" />
          <span>{project.category}</span>
        </div>

        {/* Hover Cue Banner */}
        <div
          className={`absolute inset-0 bg-plum-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="px-3 py-1.5 bg-butter-300 text-plum-900 font-mono text-xs font-bold rounded-lg border-2 border-plum-900 shadow-card flex items-center gap-1.5">
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Card Body Information */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-ivory-50 rounded-b-card">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800 tracking-tight group-hover:text-raspberry-600 transition-colors">
              {project.title}
            </h3>
            <span className="text-[11px] font-mono text-plum-400">
              #{String(project.order).padStart(2, '0')}
            </span>
          </div>

          <p className="font-mono text-xs font-semibold text-plum-700 mb-2">
            {project.subtitle}
          </p>

          <p className="font-sans text-xs sm:text-sm text-plum-800 leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-ivory-200 border border-plum-900/20 text-plum-800 text-[11px] font-mono rounded"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 bg-ivory-200 border border-plum-900/20 text-plum-600 text-[11px] font-mono rounded">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Quick link actions */}
          <div className="flex items-center justify-between pt-3 border-t border-plum-900/10 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="View Code on GitHub"
                className="p-1.5 bg-ivory-100 hover:bg-plum-800 hover:text-ivory-100 text-plum-800 rounded border border-plum-900/30 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Open Live Deployment"
                  className="p-1.5 bg-ivory-100 hover:bg-bordeaux-800 hover:text-ivory-100 text-plum-800 rounded border border-plum-900/30 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <span className="text-[11px] font-mono text-bordeaux-800 font-semibold group-hover:underline flex items-center gap-0.5">
              Details <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
