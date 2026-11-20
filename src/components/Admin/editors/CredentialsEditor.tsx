import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Certification, Achievement } from '../../../types/portfolio';
import { ShieldCheck, Trophy, Plus, Trash2, Edit3, Award, Check } from 'lucide-react';

export const CredentialsEditor: React.FC = () => {
  const { 
    certifications, 
    addCertification, 
    updateCertification, 
    deleteCertification,
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    showToast 
  } = usePortfolio();

  // Cert Form state
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('2024');
  const [certCategory, setCertCategory] = useState<'Cloud & AI' | 'Software Engineering' | 'Specialization'>('Specialization');
  const [certIdStr, setCertIdStr] = useState('');
  const [certSkillsStr, setCertSkillsStr] = useState('');

  // Achievement Form state
  const [editingAchId, setEditingAchId] = useState<string | null>(null);
  const [achTitle, setAchTitle] = useState('');
  const [achEvent, setAchEvent] = useState('');
  const [achDate, setAchDate] = useState('2024');
  const [achDesc, setAchDesc] = useState('');
  const [achColor, setAchColor] = useState('#C72C61');
  const [achType, setAchType] = useState<'hackathon' | 'academic' | 'leadership'>('hackathon');

  // Cert Handlers
  const handleStartEditCert = (c: Certification) => {
    setEditingCertId(c.id);
    setCertTitle(c.title);
    setCertIssuer(c.issuer);
    setCertDate(c.date);
    setCertCategory(c.category);
    setCertIdStr(c.credentialId || '');
    setCertSkillsStr(c.skills.join(', '));
  };

  const handleCancelCert = () => {
    setEditingCertId(null);
    setCertTitle('');
    setCertIssuer('');
    setCertIdStr('');
    setCertSkillsStr('');
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) {
      showToast('Validation Error', 'Title and Issuer are required.', 'info');
      return;
    }

    const skills = certSkillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const item: Certification = {
      id: editingCertId || `cert-${Date.now()}`,
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      date: certDate.trim() || '2024',
      category: certCategory,
      credentialId: certIdStr.trim() || undefined,
      skills: skills.length > 0 ? skills : ['Software Engineering'],
      featured: true,
    };

    if (editingCertId) {
      updateCertification(item);
    } else {
      addCertification(item);
    }
    handleCancelCert();
  };

  // Achievement Handlers
  const handleStartEditAch = (a: Achievement) => {
    setEditingAchId(a.id);
    setAchTitle(a.title);
    setAchEvent(a.event);
    setAchDate(a.date);
    setAchDesc(a.description);
    setAchColor(a.badgeColor);
    setAchType(a.type);
  };

  const handleCancelAch = () => {
    setEditingAchId(null);
    setAchTitle('');
    setAchEvent('');
    setAchDesc('');
  };

  const handleSaveAch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim() || !achEvent.trim()) {
      showToast('Validation Error', 'Title and Event name are required.', 'info');
      return;
    }

    const item: Achievement = {
      id: editingAchId || `ach-${Date.now()}`,
      title: achTitle.trim(),
      event: achEvent.trim(),
      date: achDate.trim() || '2024',
      description: achDesc.trim(),
      badgeColor: achColor,
      type: achType,
    };

    if (editingAchId) {
      updateAchievement(item);
    } else {
      addAchievement(item);
    }
    handleCancelAch();
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* 1. Verified Certifications */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Verified Certifications ({certifications.length})
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Credentials that appear in the honors gallery with preview modals.
            </p>
          </div>
        </div>

        {/* Cert Form */}
        <form onSubmit={handleSaveCert} className="p-4 bg-ivory-100 rounded-xl border border-plum-900/20 space-y-3">
          <div className="font-serif font-bold text-base text-bordeaux-800">
            {editingCertId ? 'Edit Certificate Entry' : 'Add New Certificate'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Certificate Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. DeepLearning.AI Machine Learning"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Issuer / Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford Online / DeepLearning.AI"
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Date / Year</label>
              <input
                type="text"
                placeholder="e.g. 2024"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Category</label>
              <select
                value={certCategory}
                onChange={(e) => setCertCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              >
                <option value="Cloud & AI">Cloud & AI</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Specialization">Specialization</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Credential ID</label>
              <input
                type="text"
                placeholder="e.g. DLAI-9824"
                value={certIdStr}
                onChange={(e) => setCertIdStr(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800">Skills Covered (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Neural Networks, Computer Vision, PyTorch"
              value={certSkillsStr}
              onChange={(e) => setCertSkillsStr(e.target.value)}
              className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            {editingCertId && (
              <button
                type="button"
                onClick={handleCancelCert}
                className="px-3 py-1 bg-ivory-200 text-plum-800 rounded font-mono text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-bordeaux-800 text-ivory-100 font-sans font-bold text-xs rounded-lg border border-plum-900 shadow-sm"
            >
              {editingCertId ? 'Save Certificate' : 'Add Certificate'}
            </button>
          </div>
        </form>

        {/* Existing Certs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
            <div key={c.id} className="p-3.5 bg-ivory-100 rounded-xl border border-plum-900/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-raspberry-600 font-bold mb-1">
                  <span>{c.category}</span>
                  <span className="text-plum-500">{c.date}</span>
                </div>
                <h4 className="font-serif font-bold text-base text-bordeaux-800 mb-0.5">
                  {c.title}
                </h4>
                <div className="font-mono text-xs text-plum-600 mb-2">{c.issuer}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-plum-900/10 text-xs">
                <span className="font-mono text-[10px] text-plum-500">ID: {c.credentialId || 'VERIFIED'}</span>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handleStartEditCert(c)}
                    className="p-1 text-plum-700 hover:text-bordeaux-800"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCertification(c.id)}
                    className="p-1 text-red-700 hover:text-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Honors & Achievements */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-pistachio-300 rounded-xl border border-plum-900 shadow-sm text-plum-900">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Honors & Achievements ({achievements.length})
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Collegiate hackathons, awards, and distinguished academic recognitions.
            </p>
          </div>
        </div>

        {/* Achievement Form */}
        <form onSubmit={handleSaveAch} className="p-4 bg-ivory-100 rounded-xl border border-plum-900/20 space-y-3">
          <div className="font-serif font-bold text-base text-bordeaux-800">
            {editingAchId ? 'Edit Achievement Entry' : 'Add New Distinction'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Honor / Award Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Best Human-Computer Interaction Hack"
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Event / Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Collegiate Hackathon 2024"
                value={achEvent}
                onChange={(e) => setAchEvent(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Date *</label>
              <input
                type="text"
                placeholder="e.g. November 2024"
                value={achDate}
                onChange={(e) => setAchDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Category Type</label>
              <select
                value={achType}
                onChange={(e) => setAchType(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              >
                <option value="hackathon">Hackathon Award</option>
                <option value="academic">Academic Honor / Dean's List</option>
                <option value="leadership">Leadership Distinction</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Ribbon Color</label>
              <select
                value={achColor}
                onChange={(e) => setAchColor(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              >
                <option value="#C72C61">Raspberry (#C72C61)</option>
                <option value="#1D4ED8">Cobalt (#1D4ED8)</option>
                <option value="#5C1327">Bordeaux (#5C1327)</option>
                <option value="#A8C69F">Pistachio (#A8C69F)</option>
                <option value="#E5C450">Butter Gold (#E5C450)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-plum-800">Description</label>
            <textarea
              rows={2}
              placeholder="Provide context on recognition criteria or what was built..."
              value={achDesc}
              onChange={(e) => setAchDesc(e.target.value)}
              className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            {editingAchId && (
              <button
                type="button"
                onClick={handleCancelAch}
                className="px-3 py-1 bg-ivory-200 text-plum-800 rounded font-mono text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-bordeaux-800 text-ivory-100 font-sans font-bold text-xs rounded-lg border border-plum-900 shadow-sm"
            >
              {editingAchId ? 'Save Distinction' : 'Add Distinction'}
            </button>
          </div>
        </form>

        {/* Existing Achievements list */}
        <div className="space-y-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-3.5 bg-ivory-100 rounded-xl border border-plum-900/15 flex justify-between items-start gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: ach.badgeColor }} />
              <div className="pl-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif font-bold text-base text-bordeaux-800">
                    {ach.title}
                  </h4>
                  <span className="px-2 py-0.2 bg-butter-300 text-plum-900 rounded font-mono text-[10px] font-bold">
                    {ach.date}
                  </span>
                </div>
                <div className="font-mono text-xs text-raspberry-600 font-semibold mb-1">
                  {ach.event}
                </div>
                <p className="font-sans text-xs text-plum-800">
                  {ach.description}
                </p>
              </div>

              <div className="flex space-x-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEditAch(ach)}
                  className="p-1 text-plum-700 hover:text-bordeaux-800"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteAchievement(ach.id)}
                  className="p-1 text-red-700 hover:text-red-900"
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
