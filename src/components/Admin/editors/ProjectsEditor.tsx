import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Project } from '../../../types/portfolio';
import { processImageFile } from '../../../utils/imageStorage';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  ExternalLink, 
  Github, 
  Eye, 
  EyeOff, 
  Sparkles, 
  X, 
  Check, 
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

export const ProjectsEditor: React.FC = () => {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    duplicateProject, 
    moveProjectOrder,
    showToast 
  } = usePortfolio();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [archInput, setArchInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Project Template
  const handleOpenNew = () => {
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      id,
      title: 'New Exhibition Project',
      slug: `project-${Date.now().toString().slice(-4)}`,
      subtitle: 'System Subtitle & Domain',
      tagline: 'High-impact technical overview statement',
      description: 'Clear, engaging description of what this project accomplishes and its practical impact.',
      longDescription: 'Detailed architectural overview explaining systems decisions, data flows, latency guarantees, and implementation techniques.',
      category: 'Full Stack Web Development',
      technologies: ['TypeScript', 'Python'],
      githubUrl: 'https://github.com/siribillakanti',
      liveUrl: '',
      accentColor: '#5C1327',
      secondaryColor: '#F9E498',
      textColor: '#FAF7EE',
      features: [
        'Real-time streaming pipeline with sub-40ms latency',
        'Custom algorithmic vector calculations and validation'
      ],
      architecture: [
        'Client: Responsive web interface with interactive physics feedback',
        'Backend: High-performance microservice with asynchronous job queues'
      ],
      published: true,
      featured: false,
      previewType: 'camera',
      order: projects.length + 1,
    };
    setEditingProject(newProj);
    setIsCreating(true);
  };

  const handleEdit = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsCreating(false);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      showToast('Validation Error', 'Project title is required.', 'info');
      return;
    }

    if (isCreating) {
      addProject(editingProject);
    } else {
      updateProject(editingProject);
    }

    setEditingProject(null);
    setIsCreating(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    try {
      const dataUrl = await processImageFile(file, 1200, 800, 0.88);
      setEditingProject({
        ...editingProject,
        imageUrl: dataUrl,
      });
      showToast('Thumbnail Ready', 'Project cover preview updated.', 'success');
    } catch (err) {
      showToast('Upload Failed', 'Could not process project image.', 'info');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!techInput.trim() || !editingProject) return;

    if (!editingProject.technologies.includes(techInput.trim())) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, techInput.trim()],
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter((t) => t !== tag),
    });
  };

  const handleAddFeature = () => {
    if (!featureInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      features: [...editingProject.features, featureInput.trim()],
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      features: editingProject.features.filter((_, i) => i !== idx),
    });
  };

  const handleAddArch = () => {
    if (!archInput.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      architecture: [...editingProject.architecture, archInput.trim()],
    });
    setArchInput('');
  };

  const handleRemoveArch = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      architecture: editingProject.architecture.filter((_, i) => i !== idx),
    });
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteProject(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  const colorPresets = [
    { label: 'Bordeaux', value: '#5C1327' },
    { label: 'Plum', value: '#2A102A' },
    { label: 'Cobalt', value: '#1D4ED8' },
    { label: 'Raspberry', value: '#C72C61' },
    { label: 'Pistachio', value: '#7FA375' },
    { label: 'Deep Wine', value: '#841C34' },
    { label: 'Magenta', value: '#9F1D64' },
  ];

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-5 shadow-card">
        <div>
          <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
            Exhibition Projects ({projects.length})
          </h3>
          <p className="font-sans text-xs text-plum-700 mt-0.5">
            Manage your project roster. Use the up/down arrows to change public gallery ordering.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs sm:text-sm rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-butter-300" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Card Grid / List */}
      <div className="space-y-3">
        {projects.map((proj, index) => (
          <div
            key={proj.id}
            className="group bg-ivory-50 border-2 border-plum-900 rounded-card p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-start sm:items-center space-x-4">
              {/* Order Pill & Reorder controls */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <button
                  type="button"
                  onClick={() => moveProjectOrder(proj.id, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-ivory-200 text-plum-700 disabled:opacity-25"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-ivory-200 rounded border border-plum-900/30 text-plum-900">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => moveProjectOrder(proj.id, 'down')}
                  disabled={index === projects.length - 1}
                  className="p-1 rounded hover:bg-ivory-200 text-plum-700 disabled:opacity-25"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail */}
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-plum-900 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm"
                style={{ backgroundColor: proj.accentColor }}
              >
                {proj.imageUrl ? (
                  <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono text-[10px] text-ivory-100 font-bold uppercase text-center p-1">
                    {proj.previewType}
                  </span>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-bordeaux-800">
                    {proj.title}
                  </h4>
                  {proj.published ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-mono text-[10px] font-bold flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" /> Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-mono text-[10px] font-bold flex items-center gap-1">
                      <EyeOff className="w-2.5 h-2.5" /> Draft
                    </span>
                  )}
                  {proj.featured && (
                    <span className="px-2 py-0.5 bg-butter-300 text-plum-900 border border-plum-900/30 rounded font-mono text-[10px] font-bold">
                      ★ Featured
                    </span>
                  )}
                </div>

                <p className="font-mono text-xs text-plum-600 line-clamp-1">
                  {proj.subtitle}
                </p>

                <div className="flex flex-wrap gap-1 pt-0.5">
                  <span className="px-2 py-0.2 bg-ivory-200 text-plum-800 border border-plum-900/15 rounded text-[10px] font-mono">
                    {proj.category}
                  </span>
                  {proj.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="px-1.5 py-0.2 bg-ivory-100 text-plum-700 border border-plum-900/10 rounded text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                  {proj.technologies.length > 3 && (
                    <span className="text-[10px] font-mono text-plum-500">
                      +{proj.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 self-end md:self-center pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => handleEdit(proj)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-butter-300 hover:bg-butter-400 text-plum-900 font-mono text-xs font-bold rounded-lg border border-plum-900 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => duplicateProject(proj.id)}
                className="p-1.5 bg-ivory-200 hover:bg-ivory-300 text-plum-800 rounded-lg border border-plum-900/20"
                title="Duplicate Project"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDeleteCandidate(proj)}
                className="p-1.5 bg-ivory-200 hover:bg-red-100 text-red-700 rounded-lg border border-plum-900/20"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT / CREATE MODAL ================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-plum-950/75 backdrop-blur-sm -z-10"
            onClick={() => setEditingProject(null)}
          />

          <div className="relative w-full max-w-3xl bg-ivory-50 border-3 border-plum-900 rounded-card-lg shadow-card-xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div 
              className="px-6 py-4 border-b-2 border-plum-900 flex items-center justify-between text-ivory-100"
              style={{ backgroundColor: editingProject.accentColor }}
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-butter-300 block">
                  {isCreating ? 'CREATE EXHIBITION ITEM' : 'MODIFY SPECIFICATION'}
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  {editingProject.title || 'Untitled Project'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg bg-plum-900/40 hover:bg-plum-900 text-ivory-100 border border-ivory-100/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModal} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-plum-900 font-sans text-sm">
              {/* Publication Status & Category */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-ivory-200/70 rounded-xl border border-plum-900/15">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="w-4 h-4 rounded text-bordeaux-800"
                    />
                    <span className="font-mono text-xs font-bold text-plum-900">
                      Show in Public Gallery
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-bordeaux-800"
                    />
                    <span className="font-mono text-xs font-bold text-plum-900">
                      Featured Hero Highlight
                    </span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-plum-700">Category:</span>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="px-3 py-1.5 bg-ivory-50 border-2 border-plum-900 rounded-lg font-mono text-xs text-plum-900 font-bold"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Computer Vision & Interaction">Computer Vision & Interaction</option>
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                    <option value="Cloud & Distributed Systems">Cloud & Distributed Systems</option>
                    <option value="Algorithms & Data Structures">Algorithms & Data Structures</option>
                    <option value="Creative Technology & Games">Creative Technology & Games</option>
                    <option value="Developer Tools & Productivity">Developer Tools & Productivity</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & Preview */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Project Cover Graphic / Artwork
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-ivory-100 rounded-xl border border-plum-900/20">
                  <div className="w-32 h-20 bg-plum-900 rounded-lg border-2 border-plum-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {editingProject.imageUrl ? (
                      <img src={editingProject.imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-[10px] text-ivory-200 uppercase">SVG Fallback</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-lg border border-plum-900 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-butter-300" />
                        <span>Upload Custom Image</span>
                      </button>

                      {editingProject.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, imageUrl: undefined })}
                          className="px-3 py-1.5 bg-ivory-200 hover:bg-red-100 text-red-700 font-mono text-xs rounded-lg border border-plum-900/20"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-plum-500">
                      When no image is uploaded, the interactive SVG visual preview is rendered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-plum-800 block">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-plum-800 block">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.subtitle}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Tagline (Displayed in Quotes)
                </label>
                <input
                  type="text"
                  value={editingProject.tagline}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-lg text-sm"
                />
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Short Description (Card Face) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-lg text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Detailed Systems Overview (Modal Specification) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.longDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-lg text-sm"
                />
              </div>

              {/* Technologies Tags Editor */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Technology Stack Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type technology (e.g. OpenCV) and press Enter"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    className="flex-1 px-3 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 bg-plum-900 text-ivory-100 font-mono text-xs font-bold rounded-lg"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editingProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-ivory-200 border border-plum-900/20 text-plum-900 font-mono text-xs rounded-md shadow-sm"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-red-700 hover:text-red-900 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Key Features & Technical Guarantees
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a verified technical feature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-butter-300 text-plum-900 font-mono text-xs font-bold rounded-lg border border-plum-900/30"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-1.5">
                  {editingProject.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-ivory-100 rounded border border-plum-900/15 text-xs">
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-700 hover:text-red-900 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Steps List */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  System Architecture & Pipeline Steps
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Pipeline: Camera -> OpenCV -> MediaPipe"
                    value={archInput}
                    onChange={(e) => setArchInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddArch}
                    className="px-3 py-1.5 bg-butter-300 text-plum-900 font-mono text-xs font-bold rounded-lg border border-plum-900/30"
                  >
                    Add Pipeline Step
                  </button>
                </div>

                <div className="space-y-1.5">
                  {editingProject.architecture.map((arch, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-ivory-100 rounded border border-plum-900/15 text-xs font-mono">
                      <span>[{idx + 1}] {arch}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArch(idx)}
                        className="text-red-700 hover:text-red-900 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* URLs: GitHub & Live Demo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-plum-800 block">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="text"
                    value={editingProject.githubUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-100 border border-plum-900/30 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-plum-800 block">
                    Live Demo Deployment URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-ivory-100 border border-plum-900/30 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Accent Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, accentColor: c.value })}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-mono font-bold transition-all ${
                        editingProject.accentColor === c.value
                          ? 'border-plum-900 ring-2 ring-plum-900'
                          : 'border-plum-900/20'
                      }`}
                      style={{ backgroundColor: c.value, color: '#FAF7EE' }}
                    >
                      <span>{c.label}</span>
                      {editingProject.accentColor === c.value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t-2 border-plum-900/20 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-ivory-200 hover:bg-ivory-300 text-plum-800 font-mono text-xs font-bold rounded-xl border border-plum-900/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs sm:text-sm rounded-xl border-2 border-plum-900 shadow-card"
                >
                  {isCreating ? 'Create Project' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-plum-950/75 backdrop-blur-sm -z-10" onClick={() => setDeleteCandidate(null)} />
          <div className="w-full max-w-md bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 shadow-card-xl space-y-4">
            <div className="flex items-center space-x-3 text-red-700">
              <div className="p-3 bg-red-100 rounded-xl border border-red-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-bordeaux-800">
                  Delete Project?
                </h4>
                <p className="font-mono text-xs text-plum-600">
                  This action will remove the project from the exhibition.
                </p>
              </div>
            </div>

            <p className="text-sm font-sans text-plum-800">
              Are you sure you want to remove <strong className="text-bordeaux-800">{deleteCandidate.title}</strong>? You can restore it later from factory defaults or an exported backup.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 bg-ivory-200 text-plum-800 font-mono text-xs font-bold rounded-xl border border-plum-900/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-ivory-100 font-sans font-bold text-xs rounded-xl border-2 border-plum-900 shadow-card"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
