import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { INITIAL_ABOUT_DETAILS } from '../../../data/initialData';
import { AboutContentConfig, HighlightCard } from '../../../types/portfolio';
import {
  Sparkles,
  GraduationCap,
  Code2,
  Compass,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  User,
  BookOpen,
  Award,
  Layers,
  Quote,
  Eye,
  Check
} from 'lucide-react';

export const AboutEditor: React.FC = () => {
  const { profile, updateProfile, showToast } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'intro_card' | 'philosophy' | 'academic' | 'interests' | 'preview'>('intro_card');

  // Read current aboutDetails or fallback to initial
  const about: AboutContentConfig = profile.aboutDetails || INITIAL_ABOUT_DETAILS;

  // Helper to commit updates to aboutDetails
  const handleUpdate = (updates: Partial<AboutContentConfig>) => {
    const updatedAbout: AboutContentConfig = {
      ...about,
      ...updates,
    };
    updateProfile({
      ...profile,
      aboutDetails: updatedAbout,
    });
  };

  // ==========================================
  // Philosophy Helpers (Paragraphs & Cards)
  // ==========================================
  const paragraphs = about.philosophyParagraphs || (INITIAL_ABOUT_DETAILS.philosophyParagraphs || []);

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...paragraphs];
    updated[index] = value;
    handleUpdate({ philosophyParagraphs: updated });
  };

  const handleAddParagraph = () => {
    handleUpdate({
      philosophyParagraphs: [...paragraphs, 'New engineering philosophy paragraph discussing systems craft.']
    });
    showToast('Paragraph Added', 'New paragraph appended to Philosophy.', 'success');
  };

  const handleRemoveParagraph = (index: number) => {
    if (paragraphs.length <= 1) {
      showToast('Action Blocked', 'At least one paragraph is required.', 'info');
      return;
    }
    const updated = paragraphs.filter((_, i) => i !== index);
    handleUpdate({ philosophyParagraphs: updated });
  };

  const handleMoveParagraph = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= paragraphs.length) return;
    const updated = [...paragraphs];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    handleUpdate({ philosophyParagraphs: updated });
  };

  // Highlight cards
  const highlightCards = about.philosophyHighlightCards || (INITIAL_ABOUT_DETAILS.philosophyHighlightCards || []);

  const handleCardChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = highlightCards.map((card, i) => {
      if (i === index) {
        return { ...card, [field]: value };
      }
      return card;
    });
    handleUpdate({ philosophyHighlightCards: updated });
  };

  const handleAddCard = () => {
    handleUpdate({
      philosophyHighlightCards: [
        ...highlightCards,
        { title: 'NEW ENGINEERING PILLAR', description: 'Description of your technical methodology and rigor.' }
      ]
    });
    showToast('Card Added', 'New highlight card added.', 'success');
  };

  const handleRemoveCard = (index: number) => {
    const updated = highlightCards.filter((_, i) => i !== index);
    handleUpdate({ philosophyHighlightCards: updated });
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= highlightCards.length) return;
    const updated = [...highlightCards];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    handleUpdate({ philosophyHighlightCards: updated });
  };

  // ==========================================
  // Academic Coursework Helpers
  // ==========================================
  const coursework = about.coursework || profile.education.coursework || [];
  const [newCourseInput, setNewCourseInput] = useState('');

  const handleAddCoursework = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCourseInput.trim()) return;
    if (coursework.includes(newCourseInput.trim())) {
      showToast('Course Exists', 'This course is already in your list.', 'info');
      return;
    }
    const updated = [...coursework, newCourseInput.trim()];
    handleUpdate({ coursework: updated });
    setNewCourseInput('');
    showToast('Coursework Added', `Added "${newCourseInput.trim()}"`, 'success');
  };

  const handleCourseworkChange = (index: number, value: string) => {
    const updated = [...coursework];
    updated[index] = value;
    handleUpdate({ coursework: updated });
  };

  const handleRemoveCoursework = (index: number) => {
    const updated = coursework.filter((_, i) => i !== index);
    handleUpdate({ coursework: updated });
  };

  const handleMoveCoursework = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= coursework.length) return;
    const updated = [...coursework];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    handleUpdate({ coursework: updated });
  };

  // ==========================================
  // Interests & Pursuits Helpers
  // ==========================================
  const interests = about.interests || profile.interests || [];
  const [newInterestInput, setNewInterestInput] = useState('');

  const handleAddInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newInterestInput.trim()) return;
    const updated = [...interests, newInterestInput.trim()];
    handleUpdate({ interests: updated });
    // Also sync to profile.interests for backwards compatibility
    updateProfile({
      ...profile,
      interests: updated,
      aboutDetails: { ...about, interests: updated },
    });
    setNewInterestInput('');
    showToast('Interest Added', `Added "${newInterestInput.trim()}"`, 'success');
  };

  const handleInterestChange = (index: number, value: string) => {
    const updated = [...interests];
    updated[index] = value;
    handleUpdate({ interests: updated });
    updateProfile({
      ...profile,
      interests: updated,
      aboutDetails: { ...about, interests: updated },
    });
  };

  const handleRemoveInterest = (index: number) => {
    const updated = interests.filter((_, i) => i !== index);
    handleUpdate({ interests: updated });
    updateProfile({
      ...profile,
      interests: updated,
      aboutDetails: { ...about, interests: updated },
    });
  };

  const handleMoveInterest = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= interests.length) return;
    const updated = [...interests];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    handleUpdate({ interests: updated });
    updateProfile({
      ...profile,
      interests: updated,
      aboutDetails: { ...about, interests: updated },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Editorial Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-ivory-200/80 rounded-xl border border-plum-900/15">
        <button
          type="button"
          onClick={() => setActiveTab('intro_card')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'intro_card'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Intro & Profile Card</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('philosophy')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'philosophy'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Engineering Philosophy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'academic'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic Foundation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('interests')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'interests'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-ivory-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Interests & Pursuits</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-bordeaux-800 text-ivory-100 shadow-sm'
              : 'text-plum-800 hover:bg-butter-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-butter-400" />
          <span>About Page Preview</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: INTRO & PORTRAIT CARD (PARTS A & B)
      ======================================================== */}
      {activeTab === 'intro_card' && (
        <div className="space-y-6">
          {/* A. About Page Introduction */}
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b-2 border-plum-900/15 pb-4">
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                A. About Page Introduction
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Configure the section header title, editorial subtitle, and introductory description.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={about.heading || 'About Me'}
                  onChange={(e) => handleUpdate({ heading: e.target.value })}
                  placeholder="e.g. About Me"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-bordeaux-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Editorial Subtitle / Role Description
                </label>
                <input
                  type="text"
                  value={about.subtitle || 'Computer Science Student & Creative Engineer'}
                  onChange={(e) => handleUpdate({ subtitle: e.target.value })}
                  placeholder="e.g. Computer Science Student & Creative Engineer"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-bordeaux-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Introductory Description
                </label>
                <textarea
                  rows={3}
                  value={about.description || 'Curating software craft, systems correctness, and playful digital experiences.'}
                  onChange={(e) => handleUpdate({ description: e.target.value })}
                  placeholder="Curating software craft, systems correctness, and playful digital experiences."
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-bordeaux-800"
                />
              </div>
            </div>
          </div>

          {/* B. Profile / Portrait Card Controls */}
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b-2 border-plum-900/15 pb-4">
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                B. Profile / Portrait Card Details
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Customize the tactile portrait card on the left column of your About page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Card Display Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Siri Billakanti"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Academic / Professional Identity
                </label>
                <input
                  type="text"
                  value={about.profileRole || profile.role}
                  onChange={(e) => handleUpdate({ profileRole: e.target.value })}
                  placeholder="e.g. Computer Science Student & Software Developer"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Academic Year Label (Card Stamp)
                </label>
                <input
                  type="text"
                  value={about.academicYearLabel || 'CS 2026'}
                  onChange={(e) => handleUpdate({ academicYearLabel: e.target.value })}
                  placeholder="e.g. CS 2026"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Opportunity / Internship Status
                </label>
                <input
                  type="text"
                  value={about.opportunityStatus || profile.availability}
                  onChange={(e) => handleUpdate({ opportunityStatus: e.target.value })}
                  placeholder="e.g. Available for Summer & Fall Internships"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="font-mono text-xs font-bold text-plum-800 block flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-bordeaux-800" />
                <span>Profile Card Quote / Handwritten Caption</span>
              </label>
              <textarea
                rows={2}
                value={about.profileQuote || '"Writing clean algorithms by day, designing playful interfaces by night."'}
                onChange={(e) => handleUpdate({ profileQuote: e.target.value })}
                placeholder='"Writing clean algorithms by day, designing playful interfaces by night."'
                className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-serif italic text-sm text-plum-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: ENGINEERING PHILOSOPHY (PART C)
      ======================================================== */}
      {activeTab === 'philosophy' && (
        <div className="space-y-6">
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b-2 border-plum-900/15 pb-4">
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                C. Engineering Philosophy Tab
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Configure the tab label, section heading, paragraphs, and supporting highlight cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Tab Button Label
                </label>
                <input
                  type="text"
                  value={about.philosophyTabLabel || 'Engineering Philosophy'}
                  onChange={(e) => handleUpdate({ philosophyTabLabel: e.target.value })}
                  placeholder="e.g. Engineering Philosophy"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={about.philosophyHeading || 'Where Rigor Meets Tactile Play'}
                  onChange={(e) => handleUpdate({ philosophyHeading: e.target.value })}
                  placeholder="e.g. Where Rigor Meets Tactile Play"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-serif font-bold text-sm"
                />
              </div>
            </div>

            {/* Paragraphs List Manager */}
            <div className="space-y-4 pt-4 border-t border-plum-900/15">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-plum-800 uppercase tracking-wider">
                  Philosophy Paragraphs ({paragraphs.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-butter-300 hover:bg-butter-400 text-plum-900 rounded-lg border border-plum-900 font-mono text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              <div className="space-y-3">
                {paragraphs.map((p, idx) => (
                  <div key={idx} className="p-4 bg-ivory-100 border-2 border-plum-900/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-raspberry-600">
                        Paragraph {idx + 1}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveParagraph(idx, 'up')}
                          className="p-1 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === paragraphs.length - 1}
                          onClick={() => handleMoveParagraph(idx, 'down')}
                          className="p-1 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(idx)}
                          className="p-1 hover:bg-red-100 text-red-700 rounded ml-1"
                          title="Delete paragraph"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      className="w-full px-3 py-2 bg-ivory-50 border border-plum-900/30 rounded-lg font-sans text-sm focus:outline-none focus:ring-1 focus:ring-bordeaux-800"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Highlight Cards Manager */}
            <div className="space-y-4 pt-4 border-t border-plum-900/15">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-plum-800 uppercase tracking-wider">
                  Supporting Highlight Cards ({highlightCards.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-pistachio-300 hover:bg-pistachio-400 text-plum-900 rounded-lg border border-plum-900 font-mono text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Highlight Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlightCards.map((card, idx) => (
                  <div key={idx} className="p-4 bg-ivory-100 border-2 border-plum-900/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-bordeaux-800">
                        Card #{idx + 1}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveCard(idx, 'up')}
                          className="p-1 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === highlightCards.length - 1}
                          onClick={() => handleMoveCard(idx, 'down')}
                          className="p-1 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCard(idx)}
                          className="p-1 hover:bg-red-100 text-red-700 rounded ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold text-plum-700 block">
                        Title / Tagline
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardChange(idx, 'title', e.target.value)}
                        placeholder="e.g. HIGH-THROUGHPUT RELIABILITY"
                        className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded-lg font-mono text-xs font-bold text-bordeaux-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold text-plum-700 block">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => handleCardChange(idx, 'description', e.target.value)}
                        placeholder="Description of this engineering highlight..."
                        className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded-lg font-sans text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: ACADEMIC FOUNDATION & GPA (PART D)
      ======================================================== */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b-2 border-plum-900/15 pb-4">
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                D. Academic Foundation Tab
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Manage your degree, institution, timeline, CGPA, SGPA, specialization, and coursework competencies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Tab Button Label
                </label>
                <input
                  type="text"
                  value={about.academicTabLabel || 'Academic Foundation'}
                  onChange={(e) => handleUpdate({ academicTabLabel: e.target.value })}
                  placeholder="e.g. Academic Foundation"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Section Heading / Degree Title
                </label>
                <input
                  type="text"
                  value={about.academicHeading || about.degree || profile.education.degree}
                  onChange={(e) => handleUpdate({ academicHeading: e.target.value, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-serif font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={about.institution || profile.education.institution}
                  onChange={(e) => handleUpdate({ institution: e.target.value })}
                  placeholder="e.g. SRM Institute of Science and Technology"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Graduation Timeline / Period
                </label>
                <input
                  type="text"
                  value={about.period || profile.education.period}
                  onChange={(e) => handleUpdate({ period: e.target.value })}
                  placeholder="e.g. 2022 — 2026"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  CGPA (Optional)
                </label>
                <input
                  type="text"
                  value={about.cgpa || ''}
                  onChange={(e) => handleUpdate({ cgpa: e.target.value })}
                  placeholder="e.g. 9.42 / 10.0"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  SGPA (Optional, if displayed)
                </label>
                <input
                  type="text"
                  value={about.sgpa || ''}
                  onChange={(e) => handleUpdate({ sgpa: e.target.value })}
                  placeholder="e.g. 9.6 / 10.0"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Focus & Specialization
              </label>
              <input
                type="text"
                value={about.focus || profile.education.focus}
                onChange={(e) => handleUpdate({ focus: e.target.value })}
                placeholder="e.g. Software Engineering, Computer Vision, Distributed Systems & Machine Learning"
                className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
              />
            </div>

            {/* Coursework & Competencies List */}
            <div className="space-y-4 pt-4 border-t border-plum-900/15">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-plum-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-bordeaux-800" />
                  <span>Coursework & Competencies List ({coursework.length})</span>
                </span>
              </div>

              {/* Add Coursework form */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCourseInput}
                  onChange={(e) => setNewCourseInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCoursework()}
                  placeholder="e.g. Distributed Database Architecture"
                  className="flex-1 px-4 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleAddCoursework()}
                  className="flex items-center space-x-1 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 rounded-xl font-sans font-bold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {coursework.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-ivory-100 border border-plum-900/20 rounded-xl flex items-center justify-between space-x-2"
                  >
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => handleCourseworkChange(idx, e.target.value)}
                      className="flex-1 bg-transparent font-mono text-xs text-plum-900 focus:outline-none"
                    />
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCoursework(idx, 'up')}
                        className="p-1 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === coursework.length - 1}
                        onClick={() => handleMoveCoursework(idx, 'down')}
                        className="p-1 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoursework(idx)}
                        className="p-1 hover:bg-red-100 text-red-700 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: INTERESTS & PURSUITS (PART E)
      ======================================================== */}
      {activeTab === 'interests' && (
        <div className="space-y-6">
          <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b-2 border-plum-900/15 pb-4">
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                E. Interests & Pursuits Tab
              </h3>
              <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
                Manage your creative sparks, hobbies, technical curiosities, and personal interests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Tab Button Label
                </label>
                <input
                  type="text"
                  value={about.interestsTabLabel || 'Interests & Pursuits'}
                  onChange={(e) => handleUpdate({ interestsTabLabel: e.target.value })}
                  placeholder="e.g. Interests & Pursuits"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={about.interestsHeading || 'Explorations & Creative Sparks'}
                  onChange={(e) => handleUpdate({ interestsHeading: e.target.value })}
                  placeholder="e.g. Explorations & Creative Sparks"
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-serif font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Introductory Description
              </label>
              <textarea
                rows={2}
                value={about.interestsDescription || 'When not writing code or debugging memory allocations, I immerse myself in creative and analytical pursuits that feed back into my engineering practice:'}
                onChange={(e) => handleUpdate({ interestsDescription: e.target.value })}
                className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
              />
            </div>

            {/* Interest Items List */}
            <div className="space-y-4 pt-4 border-t border-plum-900/15">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-plum-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-bordeaux-800" />
                  <span>Interests List ({interests.length})</span>
                </span>
              </div>

              {/* Add Interest form */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                  placeholder="e.g. Quantum Computing Algorithms & Qiskit"
                  className="flex-1 px-4 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleAddInterest()}
                  className="flex items-center space-x-1 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 rounded-xl font-sans font-bold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Interest</span>
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {interests.map((interest, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-ivory-100 border border-plum-900/20 rounded-xl flex items-center justify-between space-x-3"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-base select-none">✨</span>
                      <input
                        type="text"
                        value={interest}
                        onChange={(e) => handleInterestChange(idx, e.target.value)}
                        className="flex-1 bg-transparent font-sans text-sm font-semibold text-plum-900 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveInterest(idx, 'up')}
                        className="p-1.5 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === interests.length - 1}
                        onClick={() => handleMoveInterest(idx, 'down')}
                        className="p-1.5 hover:bg-ivory-200 rounded disabled:opacity-30 text-plum-700"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(idx)}
                        className="p-1.5 hover:bg-red-100 text-red-700 rounded ml-1"
                        title="Delete Interest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: LIVE ABOUT PREVIEW
      ======================================================== */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="p-4 bg-butter-300/40 rounded-xl border border-plum-900/20 text-xs font-mono text-plum-900 flex items-center justify-between">
            <span>Live visual preview of your configured About Me page</span>
            <span className="text-[11px] font-bold text-raspberry-600">Syncs immediately with all tabs</span>
          </div>

          <div className="p-4 sm:p-6 bg-ivory-100 rounded-card-lg border-2 border-plum-900 shadow-card">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                {about.heading || 'About Me'}
              </h3>
              <p className="font-mono text-xs text-raspberry-600 font-semibold">
                {about.subtitle || 'Computer Science Student & Creative Engineer'}
              </p>
              <p className="font-sans text-xs text-plum-700 mt-1">
                {about.description || 'Curating software craft, systems correctness, and playful digital experiences.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-ivory-50 border border-plum-900/20 rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-bordeaux-800 block">
                  Portrait Card Preview
                </span>
                <p className="font-serif font-bold text-lg text-plum-900">{profile.name}</p>
                <p className="font-mono text-xs text-plum-600">{about.profileRole || profile.role}</p>
                <p className="font-mono text-[11px] text-raspberry-600">Stamp: {about.academicYearLabel || 'CS 2026'}</p>
                <p className="font-serif italic text-xs text-plum-800 pt-1">{about.profileQuote || '"Writing clean algorithms..."'}</p>
              </div>

              <div className="p-4 bg-ivory-50 border border-plum-900/20 rounded-xl space-y-2">
                <span className="font-mono text-xs font-bold text-bordeaux-800 block">
                  Tab 1: {about.philosophyTabLabel || 'Philosophy'}
                </span>
                <p className="font-serif font-bold text-sm text-plum-900">{about.philosophyHeading || 'Where Rigor Meets Tactile Play'}</p>
                <p className="font-sans text-xs text-plum-700">{paragraphs[0]?.slice(0, 100)}...</p>
                <span className="font-mono text-[11px] text-pistachio-800 block pt-1">
                  Highlight Cards: {highlightCards.length} configured
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
