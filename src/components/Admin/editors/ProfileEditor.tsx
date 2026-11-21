import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { processImageFile } from '../../../utils/imageStorage';
import { AboutEditor } from './AboutEditor';
import { 
  Upload, 
  Trash2, 
  Plus, 
  User, 
  Check, 
  Sparkles,
  Eye,
  Sliders,
  Flower2,
  Cpu,
  Camera,
  Layers,
  Terminal,
  Compass,
  FileText,
  BookOpen
} from 'lucide-react';

export const ProfileEditor: React.FC = () => {
  const { profile, updateProfile, uploadProfilePhoto, removeProfilePhoto, showToast } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'hero' | 'decorations' | 'preview'>('profile');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please upload a PNG, JPG, or WEBP image file.', 'info');
      return;
    }

    try {
      setIsProcessingImage(true);
      const dataUrl = await processImageFile(file, 800, 800, 0.9);
      await uploadProfilePhoto(dataUrl);
      showToast('Photo Saved', 'Profile photograph stored successfully in IndexedDB.', 'success');
    } catch (err) {
      showToast('Upload Error', 'Could not process photo.', 'info');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEditorialParagraphChange = (index: number, value: string) => {
    const newBio = [...profile.editorialBio];
    newBio[index] = value;
    updateProfile({ ...profile, editorialBio: newBio });
  };

  const handleAddEditorialParagraph = () => {
    updateProfile({
      ...profile,
      editorialBio: [...profile.editorialBio, 'New biography paragraph discussing software craft and systems philosophy.'],
    });
  };

  const handleRemoveEditorialParagraph = (index: number) => {
    if (profile.editorialBio.length <= 1) {
      showToast('Notice', 'At least one biography paragraph is required.', 'info');
      return;
    }
    const newBio = profile.editorialBio.filter((_, i) => i !== index);
    updateProfile({ ...profile, editorialBio: newBio });
  };

  const currentShape = profile.photoFrameShape || 'rounded';
  const currentPos = profile.photoPosition || 'center';

  const shapeClass = (() => {
    if (currentShape === 'circle') return 'rounded-full';
    if (currentShape === 'square') return 'rounded-2xl';
    return 'rounded-3xl';
  })();

  const posClass = (() => {
    if (currentPos === 'top') return 'object-top';
    if (currentPos === 'bottom') return 'object-bottom';
    return 'object-center';
  })();

  const heroConfig = profile.heroCardConfig || {
    primaryButtonLabel: 'Explore Projects',
    secondaryButtonLabel: 'Inspect Resume',
    invitationText: 'Software engineer & creative developer',
  };

  const decConfig = profile.decorationsConfig || {
    showWordle: true,
    showPacman: true,
    showCamera: true,
    showVintageCamera: true,
    showInstantCamera: true,
    showCallaLily: true,
    showOrchid: true,
    showTigerLily: true,
    showMicrochip: true,
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Sub-tab navigation for Profile sections */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-ivory-200/80 rounded-xl border border-plum-900/15">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          Identity & Photo
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'about'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>About Me Page</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'hero'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          Hero Card & Buttons
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('decorations')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'decorations'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          Surrounding Illustrations
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-butter-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-butter-400" />
          <span>Live Card Preview</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: IDENTITY, PHOTO & BIOGRAPHY
      ======================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          {/* 1. Portrait Photography Card with Frame Shape Options */}
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                Portrait Photography & Frame Architecture
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Upload your personal photograph. Choose your preferred frame geometry and image focus point.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-ivory-200/70 rounded-2xl border border-plum-900/15">
              {/* Dynamic Frame Shape Avatar Preview */}
              <div 
                className={`relative w-32 h-32 sm:w-36 sm:h-36 border-3 border-plum-900 overflow-hidden shadow-card bg-plum-900 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${shapeClass}`}
              >
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className={`w-full h-full object-cover transition-all ${posClass} ${shapeClass}`}
                  />
                ) : (
                  <div className="text-center p-2 text-ivory-200">
                    <User className="w-12 h-12 mx-auto text-butter-300 mb-1" />
                    <span className="text-[10px] font-mono leading-tight block">Stylized SVG Active</span>
                  </div>
                )}

                {isProcessingImage && (
                  <div className="absolute inset-0 bg-plum-950/70 flex items-center justify-center text-ivory-100 font-mono text-xs">
                    Saving...
                  </div>
                )}
              </div>

              {/* Action buttons & Frame selectors */}
              <div className="space-y-4 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="profile-photo-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5 text-butter-300" />
                    <span>{profile.photoUrl ? 'Replace Photograph' : 'Upload Photograph'}</span>
                  </button>

                  {profile.photoUrl && (
                    <button
                      type="button"
                      onClick={removeProfilePhoto}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-ivory-100 hover:bg-red-100 text-red-700 font-mono text-xs font-bold rounded-xl border border-plum-900/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                {/* Frame Shape Selector */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-mono text-xs font-bold text-plum-800 block">
                    Frame Geometry Shape:
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {(['circle', 'square', 'rounded'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => updateProfile({ ...profile, photoFrameShape: shape })}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                          currentShape === shape
                            ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-sm'
                            : 'bg-ivory-100 text-plum-800 border-plum-900/30 hover:bg-butter-300'
                        }`}
                      >
                        {shape === 'circle' && '● Circle'}
                        {shape === 'square' && '■ Square'}
                        {shape === 'rounded' && '▢ Rounded Rectangle'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Focus Position */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold text-plum-800 block">
                    Image Alignment Focus:
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {(['center', 'top', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => updateProfile({ ...profile, photoPosition: pos })}
                        className={`px-3 py-1 rounded-md font-mono text-xs font-semibold border transition-all ${
                          currentPos === pos
                            ? 'bg-plum-900 text-ivory-100 border-plum-900'
                            : 'bg-ivory-100 text-plum-800 border-plum-900/20 hover:bg-ivory-50'
                        }`}
                      >
                        {pos.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Core Profile Information */}
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                Core Identity & Contact Information
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Rendered across the hero card, page title, and meta information.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Professional Role / Title *
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => updateProfile({ ...profile, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Short Elevator Introduction (Hero Card Front) *
              </label>
              <textarea
                rows={2}
                value={profile.shortBio}
                onChange={(e) => updateProfile({ ...profile, shortBio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Availability Badge Text *
                </label>
                <input
                  type="text"
                  value={profile.availability}
                  onChange={(e) => updateProfile({ ...profile, availability: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-xs text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Availability Status Pulse
                </label>
                <select
                  value={profile.availabilityStatus}
                  onChange={(e) => updateProfile({ ...profile, availabilityStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-xs text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                >
                  <option value="available">🟢 Available (Green Ping)</option>
                  <option value="exploring">🟡 Exploring Opportunities (Amber)</option>
                  <option value="busy">🔴 Busy / Not Looking</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Location Badge
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => updateProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-xs text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={profile.github}
                  onChange={(e) => updateProfile({ ...profile, github: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-xs text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => updateProfile({ ...profile, linkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-xs text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* 3. Editorial Biography Paragraphs */}
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                  Editorial Biography Dossier
                </h3>
                <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                  The in-depth paragraphs revealed inside the expandable hero profile card and About section.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddEditorialParagraph}
                className="flex items-center space-x-1 px-3 py-1.5 bg-butter-300 hover:bg-butter-400 text-plum-900 font-mono text-xs font-bold rounded-lg border border-plum-900 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-4">
              {profile.editorialBio.map((paragraph, index) => (
                <div key={index} className="space-y-1.5 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15">
                  <div className="flex justify-between items-center text-xs font-mono text-plum-600">
                    <span className="font-bold">PARAGRAPH #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEditorialParagraph(index)}
                      className="text-red-700 hover:text-red-900"
                      title="Delete Paragraph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={paragraph}
                    onChange={(e) => handleEditorialParagraphChange(index, e.target.value)}
                    className="w-full px-3 py-2 bg-ivory-50 border border-plum-900/30 rounded-lg font-sans text-sm text-plum-900 focus:outline-none focus:ring-1 focus:ring-bordeaux-800 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 1B: ABOUT ME PAGE DOSSIER
      ======================================================== */}
      {activeTab === 'about' && (
        <AboutEditor />
      )}

      {/* ========================================================
          TAB 2: HERO CARD & BUTTONS CONFIG
      ======================================================== */}
      {activeTab === 'hero' && (
        <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Hero Profile Card & Action Destinations
            </h3>
            <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
              Customize the interactive buttons, invitations, and supporting text on your homepage profile card.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Primary Action Button Label
              </label>
              <input
                type="text"
                value={heroConfig.primaryButtonLabel || ''}
                placeholder="Explore Projects"
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    heroCardConfig: {
                      ...heroConfig,
                      primaryButtonLabel: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
              />
              <span className="text-[11px] font-mono text-plum-500">
                Triggers smooth scroll to Projects Exhibition.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Secondary Action Button Label
              </label>
              <input
                type="text"
                value={heroConfig.secondaryButtonLabel || ''}
                placeholder="Inspect Resume"
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    heroCardConfig: {
                      ...heroConfig,
                      secondaryButtonLabel: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
              />
              <span className="text-[11px] font-mono text-plum-500">
                Opens the Resume Modal viewer.
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Bottom Invitation Teaser Text
            </label>
            <input
              type="text"
              value={heroConfig.invitationText || ''}
              placeholder="Computer Science student & creative developer"
              onChange={(e) =>
                updateProfile({
                  ...profile,
                  heroCardConfig: {
                    ...heroConfig,
                    invitationText: e.target.value,
                  },
                })
              }
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
            />
            <span className="text-[11px] font-mono text-plum-500">
              Displayed along the bottom card accent bar beside the current year.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: DECORATIVE ILLUSTRATIONS CONTROLS
      ======================================================== */}
      {activeTab === 'decorations' && (
        <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Surrounding Illustrated Objects Controls
            </h3>
            <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
              Toggle specific botanical illustrations and technical objects in the homepage garden around the profile card.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wordle */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showWordle !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showWordle: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  WordleRush Tiles (S-I-R-I)
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Interactive multi-color letter tiles linked to WordleRush project.
                </span>
              </div>
            </label>

            {/* Pac-Man */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showPacman !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showPacman: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Pac-Man Arcade
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Playful retro arcade character linked to GesturePac.
                </span>
              </div>
            </label>

            {/* Vintage Camera */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showVintageCamera !== false && decConfig.showCamera !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showVintageCamera: e.target.checked, showCamera: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Vintage Mechanical Rangefinder Camera
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Detailed 35mm rangefinder with tactile dials and red dot.
                </span>
              </div>
            </label>

            {/* Instant Camera */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showInstantCamera !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showInstantCamera: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Minimal Retro Instant Camera
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Two-tone compact analog camera with flash bar.
                </span>
              </div>
            </label>

            {/* Calla Lily */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showCallaLily !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showCallaLily: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Burgundy & Ivory Calla Lily
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Graceful botanical spathe with yellow spadix and curving stem.
                </span>
              </div>
            </label>

            {/* Tiger Lilies */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showTigerLily !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showTigerLily: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Tiger Lilies (Recurved Petals & Freckles)
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Hand-crafted reflexed orange petals with dark spots & arching stamens.
                </span>
              </div>
            </label>

            {/* Magenta Orchid */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showOrchid !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showOrchid: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Magenta Orchid Bloom
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Intricate multi-petal phalaenopsis botanical flower.
                </span>
              </div>
            </label>

            {/* Silicon Microchip */}
            <label className="flex items-start space-x-3 p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 cursor-pointer hover:bg-ivory-200/70 transition-colors">
              <input
                type="checkbox"
                checked={decConfig.showMicrochip !== false}
                onChange={(e) =>
                  updateProfile({
                    ...profile,
                    decorationsConfig: { ...decConfig, showMicrochip: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <div>
                <span className="font-mono text-xs font-bold text-plum-900 block">
                  Silicon Microchip IC
                </span>
                <span className="text-[11px] font-sans text-plum-600">
                  Gold pins and circuitry representing systems engineering.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: LIVE PROFILE CARD PREVIEW
      ======================================================== */}
      {activeTab === 'preview' && (
        <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-bordeaux-800" />
                <span>Live Homepage Profile Card Preview</span>
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                This shows how your card will appear on the live public website with your current settings.
              </p>
            </div>
            <span className="px-3 py-1 bg-pistachio-300 text-plum-900 font-mono text-xs font-bold rounded-lg border border-plum-900">
              Live Synchronized
            </span>
          </div>

          {/* Miniature rendering of the Profile Card */}
          <div className="p-6 bg-ivory-200/60 rounded-2xl border-2 border-dashed border-plum-900/20 flex justify-center">
            <div className="w-full max-w-[580px] bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card-lg relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-plum-900/15 pb-3 mb-4">
                <span className="text-xs font-mono text-plum-800 bg-pistachio-300/40 px-3 py-1 rounded-full border border-pistachio-600">
                  🟢 {profile.availability}
                </span>
                <span className="text-xs font-mono text-plum-600">
                  📍 {profile.location}
                </span>
              </div>

              {/* Identity */}
              <div className="space-y-1 mb-3">
                <h4 className="font-serif text-3xl font-bold text-bordeaux-800">
                  {profile.name}
                </h4>
                <p className="font-mono text-xs text-raspberry-600 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 inline" />
                  {profile.role}
                </p>
              </div>

              {/* Bio */}
              <p className="font-sans text-sm text-plum-900 leading-relaxed mb-5">
                {profile.shortBio}
              </p>

              {/* Frame preview badge */}
              <div className="flex items-center gap-3 p-3 bg-ivory-200 rounded-xl mb-4 text-xs font-mono">
                <div className={`w-10 h-10 border-2 border-plum-900 bg-plum-900 overflow-hidden flex-shrink-0 ${shapeClass}`}>
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt="Preview" className={`w-full h-full object-cover ${posClass}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-butter-300 text-xs font-bold">SB</div>
                  )}
                </div>
                <div>
                  <span className="font-bold text-plum-900">Configured Frame: </span>
                  <span className="capitalize">{currentShape} frame, {currentPos} focus</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="px-3 py-2 bg-bordeaux-800 text-ivory-100 font-sans font-bold text-xs rounded-xl border border-plum-900 text-center">
                  {heroConfig.primaryButtonLabel || 'Explore Projects'}
                </div>
                <div className="px-3 py-2 bg-butter-300 text-plum-900 font-sans font-bold text-xs rounded-xl border border-plum-900 text-center">
                  {heroConfig.secondaryButtonLabel || 'Inspect Resume'}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-2.5 border-t border-plum-900/10 flex items-center justify-between text-[11px] font-mono text-plum-500">
                <span>{heroConfig.invitationText || 'Software engineer & creative developer'}</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};