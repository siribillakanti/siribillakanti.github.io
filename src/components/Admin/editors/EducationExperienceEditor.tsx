import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ExperienceItem } from '../../../types/portfolio';
import { GraduationCap, Briefcase, Plus, Trash2, Edit3, BookOpen, Check } from 'lucide-react';

export const EducationExperienceEditor: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    addExperience, 
    updateExperience, 
    deleteExperience,
    showToast 
  } = usePortfolio();

  const [courseInput, setCourseInput] = useState('');
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Experience form
  const [expRole, setExpRole] = useState('');
  const [expOrg, setExpOrg] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expType, setExpType] = useState<'work' | 'research' | 'leadership' | 'extracurricular'>('research');

  // Education update
  const handleUpdateEducation = (field: string, val: any) => {
    updateProfile({
      ...profile,
      education: {
        ...profile.education,
        [field]: val,
      },
    });
  };

  const handleAddCourse = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!courseInput.trim()) return;

    if (!profile.education.coursework.includes(courseInput.trim())) {
      handleUpdateEducation('coursework', [...profile.education.coursework, courseInput.trim()]);
    }
    setCourseInput('');
  };

  const handleRemoveCourse = (course: string) => {
    handleUpdateEducation(
      'coursework',
      profile.education.coursework.filter((c) => c !== course)
    );
  };

  const handleStartEditExp = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setExpRole(exp.role);
    setExpOrg(exp.organization);
    setExpPeriod(exp.period);
    setExpLocation(exp.location || '');
    setExpDesc(exp.description);
    setExpType(exp.type);
  };

  const handleCancelExp = () => {
    setEditingExpId(null);
    setExpRole('');
    setExpOrg('');
    setExpPeriod('');
    setExpLocation('');
    setExpDesc('');
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expOrg.trim()) {
      showToast('Validation Error', 'Role and Organization are required.', 'info');
      return;
    }

    const item: ExperienceItem = {
      id: editingExpId || `exp-${Date.now()}`,
      role: expRole.trim(),
      organization: expOrg.trim(),
      period: expPeriod.trim() || '2024 - Present',
      location: expLocation.trim() || undefined,
      description: expDesc.trim(),
      type: expType,
    };

    if (editingExpId) {
      updateExperience(item);
    } else {
      addExperience(item);
    }
    handleCancelExp();
  };

  const experiences = profile.experiences || [];

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* 1. Academic Education */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Academic Education
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Displayed on the About Me dossier and Resume Dossier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Degree & Major *
            </label>
            <input
              type="text"
              value={profile.education.degree}
              onChange={(e) => handleUpdateEducation('degree', e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              University / Institution *
            </label>
            <input
              type="text"
              value={profile.education.institution}
              onChange={(e) => handleUpdateEducation('institution', e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Graduation Timeline *
            </label>
            <input
              type="text"
              value={profile.education.period}
              onChange={(e) => handleUpdateEducation('period', e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Focus & Specialization
            </label>
            <input
              type="text"
              value={profile.education.focus}
              onChange={(e) => handleUpdateEducation('focus', e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Coursework Chips Editor */}
        <div className="space-y-2 pt-2 border-t border-plum-900/10">
          <label className="font-mono text-xs font-bold text-plum-800 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-bordeaux-800" />
            <span>Coursework Competencies</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Distributed Systems & Cloud Computing"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              onKeyDown={handleAddCourse}
              className="flex-1 px-3 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg text-xs font-mono"
            />
            <button
              type="button"
              onClick={handleAddCourse}
              className="px-3 py-1.5 bg-bordeaux-800 text-ivory-100 font-mono text-xs font-bold rounded-lg"
            >
              Add Course
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.education.coursework.map((course) => (
              <span
                key={course}
                className="flex items-center space-x-1 px-2.5 py-1 bg-ivory-100 border border-plum-900/20 text-plum-900 font-mono text-xs rounded-md shadow-sm"
              >
                <span>{course}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCourse(course)}
                  className="text-red-700 hover:text-red-900 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Professional & Research Experience */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-pistachio-300 rounded-xl border border-plum-900 shadow-sm text-plum-900">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Experience & Leadership
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Lab research roles, teaching assistantships, open source leadership, and industry internships.
            </p>
          </div>
        </div>

        {/* Form to add or edit experience */}
        <form onSubmit={handleSaveExp} className="p-4 bg-ivory-100 rounded-xl border border-plum-900/20 space-y-3">
          <div className="font-serif font-bold text-base text-bordeaux-800">
            {editingExpId ? 'Edit Experience Item' : 'Add Experience Entry'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Role / Position *</label>
              <input
                type="text"
                required
                placeholder="e.g. Research Fellow"
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Organization / Lab *</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Vision Lab"
                value={expOrg}
                onChange={(e) => setExpOrg(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Period *</label>
              <input
                type="text"
                placeholder="e.g. 2024 - Present"
                value={expPeriod}
                onChange={(e) => setExpPeriod(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Category Type</label>
              <select
                value={expType}
                onChange={(e) => setExpType(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              >
                <option value="research">Academic / Research</option>
                <option value="leadership">Leadership / Mentorship</option>
                <option value="work">Software Engineering</option>
                <option value="extracurricular">Extracurricular</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800">Summary Description</label>
            <textarea
              rows={2}
              placeholder="Highlight technical contributions, technologies used, or students mentored..."
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            {editingExpId && (
              <button
                type="button"
                onClick={handleCancelExp}
                className="px-3 py-1 bg-ivory-200 text-plum-800 rounded font-mono text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-bordeaux-800 text-ivory-100 font-sans font-bold text-xs rounded-lg border border-plum-900 shadow-sm"
            >
              {editingExpId ? 'Save Experience' : 'Add Experience'}
            </button>
          </div>
        </form>

        {/* Existing experiences list */}
        <div className="space-y-2.5">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif font-bold text-base text-bordeaux-800">
                    {exp.role}
                  </h4>
                  <span className="px-2 py-0.2 bg-butter-300 text-plum-900 rounded font-mono text-[10px] font-bold">
                    {exp.type}
                  </span>
                </div>
                <div className="font-mono text-xs text-plum-600 mb-1">
                  {exp.organization} • {exp.period}
                </div>
                <p className="font-sans text-xs text-plum-800">
                  {exp.description}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 self-end sm:self-start flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEditExp(exp)}
                  className="p-1.5 bg-ivory-200 hover:bg-butter-300 rounded text-plum-800"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteExperience(exp.id)}
                  className="p-1.5 bg-ivory-200 hover:bg-red-200 text-red-700 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
