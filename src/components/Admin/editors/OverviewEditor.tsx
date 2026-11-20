import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  FolderKanban, 
  UserCheck, 
  Sparkles, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ExternalLink,
  Layers,
  Flame
} from 'lucide-react';

interface OverviewEditorProps {
  onNavigate: (tab: any) => void;
  onPreview: () => void;
}

export const OverviewEditor: React.FC<OverviewEditorProps> = ({ onNavigate, onPreview }) => {
  const { profile, projects, skills, certifications, achievements, hasUnsavedChanges, lastSavedTimestamp } = usePortfolio();

  const publishedCount = projects.filter((p) => p.published).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome & Status Banner */}
      <div className="bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-butter-300 rounded-full border border-plum-900/30 text-xs font-mono font-bold text-plum-900">
            <Sparkles className="w-3.5 h-3.5 text-bordeaux-800" />
            <span>PORTFOLIO CMS CONTROL DECK</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bordeaux-800">
            Welcome back, {profile.name.split(' ')[0]}
          </h2>
          <p className="font-sans text-sm sm:text-base text-plum-700 max-w-2xl leading-relaxed">
            Manage your personal portfolio's live content, upload cover graphics and profile photography, reorder exhibition projects, and configure technical competencies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10">
          <button
            onClick={onPreview}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs sm:text-sm rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-butter-300" />
            <span>View Public Site</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Metric */}
        <div 
          onClick={() => onNavigate('projects')}
          className="cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-card p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-plum-600 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold">Projects</span>
            <FolderKanban className="w-4 h-4 text-bordeaux-800" />
          </div>
          <div className="font-serif text-3xl font-bold text-bordeaux-800">
            {projects.length}
          </div>
          <div className="mt-2 text-xs font-mono text-plum-600 flex items-center justify-between">
            <span className="text-emerald-700 font-bold">{publishedCount} published</span>
            {draftCount > 0 && <span className="text-amber-700 font-bold">{draftCount} drafts</span>}
          </div>
        </div>

        {/* Skills Metric */}
        <div 
          onClick={() => onNavigate('skills')}
          className="cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-card p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-plum-600 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold">Skills</span>
            <Flame className="w-4 h-4 text-raspberry-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-bordeaux-800">
            {skills.length}
          </div>
          <div className="mt-2 text-xs font-mono text-plum-600">
            Across 5 Core Domains
          </div>
        </div>

        {/* Certifications Metric */}
        <div 
          onClick={() => onNavigate('credentials')}
          className="cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-card p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-plum-600 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold">Credentials</span>
            <Award className="w-4 h-4 text-cobalt-700" />
          </div>
          <div className="font-serif text-3xl font-bold text-bordeaux-800">
            {certifications.length}
          </div>
          <div className="mt-2 text-xs font-mono text-plum-600">
            {achievements.length} Verified Honors
          </div>
        </div>

        {/* Storage Health */}
        <div 
          onClick={() => onNavigate('settings')}
          className="cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-card p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center justify-between text-plum-600 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold">Storage State</span>
            <Database className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-800">
            Active
          </div>
          <div className="mt-2 text-[11px] font-mono text-plum-600 truncate">
            IndexedDB + LocalStorage
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <h3 className="font-serif text-xl font-bold text-bordeaux-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-bordeaux-800" />
          Quick Management Workspaces
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div 
            onClick={() => onNavigate('projects')}
            className="group cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-butter-300 border border-plum-900 flex items-center justify-center text-bordeaux-800 mb-3 group-hover:scale-105 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-bordeaux-800 mb-1 group-hover:text-raspberry-600 transition-colors">
                Manage Exhibition Projects
              </h4>
              <p className="font-sans text-xs text-plum-700 leading-relaxed mb-4">
                Add new projects, upload custom cover artwork, edit system architecture tags, and rearrange gallery order.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono font-bold text-bordeaux-800 gap-1 pt-2 border-t border-plum-900/10">
              <span>Open Project Manager</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('profile')}
            className="group cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-pistachio-300 border border-plum-900 flex items-center justify-center text-plum-900 mb-3 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-bordeaux-800 mb-1 group-hover:text-raspberry-600 transition-colors">
                Profile & Portrait Photography
              </h4>
              <p className="font-sans text-xs text-plum-700 leading-relaxed mb-4">
                Upload your portrait photo from your computer, adjust availability status, and edit editorial biography dossiers.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono font-bold text-bordeaux-800 gap-1 pt-2 border-t border-plum-900/10">
              <span>Edit Profile & Photo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('skills')}
            className="group cursor-pointer bg-ivory-50 border-2 border-plum-900 rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-raspberry-100 border border-plum-900 flex items-center justify-center text-raspberry-700 mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-bordeaux-800 mb-1 group-hover:text-raspberry-600 transition-colors">
                Skills & Tech Stack
              </h4>
              <p className="font-sans text-xs text-plum-700 leading-relaxed mb-4">
                Update daily driver languages, frameworks, AI/ML libraries, and add custom badges for core competencies.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono font-bold text-bordeaux-800 gap-1 pt-2 border-t border-plum-900/10">
              <span>Curate Stack</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
