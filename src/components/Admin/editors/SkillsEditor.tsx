import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { SkillItem } from '../../../types/portfolio';
import { Plus, Trash2, Edit3, Sparkles, Check, Flame } from 'lucide-react';

export const SkillsEditor: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill, showToast } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'languages' | 'frontend' | 'backend' | 'ai' | 'tools'>('languages');
  const [formBadge, setFormBadge] = useState('');
  const [formHighlight, setFormHighlight] = useState(true);

  const categories = [
    { id: 'all', label: 'All Technologies' },
    { id: 'languages', label: 'Languages' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend & DBs' },
    { id: 'ai', label: 'AI & Vision' },
    { id: 'tools', label: 'Tools & Platforms' },
  ];

  const handleStartEdit = (index: number) => {
    const s = skills[index];
    setEditingIndex(index);
    setFormName(s.name);
    setFormCategory(s.category);
    setFormBadge(s.badge || '');
    setFormHighlight(!!s.highlight);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormName('');
    setFormBadge('');
    setFormHighlight(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Validation Error', 'Skill name cannot be blank.', 'info');
      return;
    }

    const item: SkillItem = {
      name: formName.trim(),
      category: formCategory,
      badge: formBadge.trim() || undefined,
      highlight: formHighlight,
    };

    if (editingIndex !== null) {
      updateSkill(editingIndex, item);
      showToast('Skill Updated', `"${item.name}" updated.`);
    } else {
      addSkill(item);
    }

    handleCancel();
  };

  const filteredSkills = skills
    .map((skill, originalIndex) => ({ skill, originalIndex }))
    .filter(({ skill }) => activeCategory === 'all' || skill.category === activeCategory);

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Creation / Edit Card */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-7 shadow-card space-y-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
            {editingIndex !== null ? `Edit Skill: ${skills[editingIndex].name}` : 'Add New Skill or Framework'}
          </h3>
          <p className="font-sans text-xs text-plum-700 mt-0.5">
            Maintain your technical competencies. Categorize by domain and optionally add a highlight badge.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-1">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Technology Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PyTorch, Rust, Docker"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Domain Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
              >
                <option value="languages">Programming Languages</option>
                <option value="frontend">Frontend & UI</option>
                <option value="backend">Backend & Databases</option>
                <option value="ai">AI & Computer Vision</option>
                <option value="tools">Tools, DevOps & Platforms</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Badge Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Daily Driver, Core OOP"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formHighlight}
                onChange={(e) => setFormHighlight(e.target.checked)}
                className="rounded text-bordeaux-800"
              />
              <span className="font-mono text-xs font-bold text-plum-800">
                Highlight on homepage stack sticker cluster
              </span>
            </label>

            <div className="flex space-x-2">
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3.5 py-1.5 bg-ivory-200 text-plum-800 font-mono text-xs font-bold rounded-lg border border-plum-900/30"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs rounded-xl border-2 border-plum-900 shadow-card"
              >
                {editingIndex !== null ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-butter-300" />}
                <span>{editingIndex !== null ? 'Save Skill' : 'Add Skill'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-plum-900/15 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border-2 border-plum-900 ${
              activeCategory === cat.id
                ? 'bg-bordeaux-800 text-ivory-100 font-bold shadow-card'
                : 'bg-ivory-50 text-plum-800 hover:bg-butter-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredSkills.map(({ skill, originalIndex }) => (
          <div
            key={skill.name}
            className="group bg-ivory-50 border-2 border-plum-900 rounded-xl p-3 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="font-mono text-xs font-bold text-plum-900">
                  {skill.name}
                </span>
                {skill.badge && (
                  <span className="px-1.5 py-0.2 bg-butter-300 border border-plum-900 rounded text-[9px] font-mono font-bold text-plum-900">
                    {skill.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-plum-500 capitalize block">
                {skill.category}
              </span>
            </div>

            <div className="flex items-center justify-end space-x-1.5 pt-2 mt-2 border-t border-plum-900/10">
              <button
                type="button"
                onClick={() => handleStartEdit(originalIndex)}
                className="p-1 text-plum-700 hover:text-bordeaux-800"
                title="Edit Skill"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => deleteSkill(skill.name)}
                className="p-1 text-red-700 hover:text-red-900"
                title="Delete Skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
