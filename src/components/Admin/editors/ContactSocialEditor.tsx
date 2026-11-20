import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { SocialLink } from '../../../types/portfolio';
import { Mail, Github, Linkedin, Globe, Plus, Trash2, Edit3, Send } from 'lucide-react';

export const ContactSocialEditor: React.FC = () => {
  const { profile, updateProfile, addSocialLink, updateSocialLink, deleteSocialLink, showToast } = usePortfolio();

  const [platformInput, setPlatformInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformInput.trim() || !urlInput.trim()) {
      showToast('Validation Error', 'Platform name and URL are required.', 'info');
      return;
    }

    const item: SocialLink = {
      id: editingId || `soc-${Date.now()}`,
      platform: platformInput.trim(),
      url: urlInput.trim(),
      label: labelInput.trim() || urlInput.trim(),
    };

    if (editingId) {
      updateSocialLink(item);
      setEditingId(null);
    } else {
      addSocialLink(item);
    }

    setPlatformInput('');
    setUrlInput('');
    setLabelInput('');
  };

  const handleStartEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setPlatformInput(link.platform);
    setUrlInput(link.url);
    setLabelInput(link.label || '');
  };

  const handleCancel = () => {
    setEditingId(null);
    setPlatformInput('');
    setUrlInput('');
    setLabelInput('');
  };

  const links = profile.socialLinks || [];

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
            Contact Channels & Social Identity
          </h3>
          <p className="font-sans text-xs text-plum-700 mt-1">
            Displayed in the interactive airmail postcard in the Contact section and hero shortcuts.
          </p>
        </div>

        {/* Primary Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Primary Correspondence Email *
            </label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => updateProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Geographic Relocation Status
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateProfile({ ...profile, location: e.target.value })}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              GitHub Profile URL *
            </label>
            <input
              type="text"
              value={profile.github}
              onChange={(e) => updateProfile({ ...profile, github: e.target.value })}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              LinkedIn Profile URL *
            </label>
            <input
              type="text"
              value={profile.linkedin}
              onChange={(e) => updateProfile({ ...profile, linkedin: e.target.value })}
              className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Additional Social Links */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
            Additional Custom Links
          </h3>
          <p className="font-sans text-xs text-plum-700 mt-1">
            Add links to Discord, Twitter/X, personal technical blogs, or university profiles.
          </p>
        </div>

        <form onSubmit={handleAddOrUpdate} className="p-4 bg-ivory-100 rounded-xl border border-plum-900/20 space-y-3">
          <div className="font-serif font-bold text-sm text-bordeaux-800">
            {editingId ? 'Edit Social Link' : 'Add New Link'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800">Platform Name *</label>
              <input
                type="text"
                placeholder="e.g. Substack, X, DevPost"
                value={platformInput}
                onChange={(e) => setPlatformInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-mono text-xs font-bold text-plum-800">Target URL *</label>
              <input
                type="text"
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-ivory-50 border border-plum-900/30 rounded text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 bg-ivory-200 text-plum-800 rounded font-mono text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-bordeaux-800 text-ivory-100 font-sans font-bold text-xs rounded-lg border border-plum-900 shadow-sm"
            >
              {editingId ? 'Save Link' : 'Add Link'}
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-3 bg-ivory-100 rounded-xl border border-plum-900/15 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-plum-900 font-mono">{link.platform}: </span>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-bordeaux-800 hover:underline font-mono">
                  {link.url}
                </a>
              </div>

              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => handleStartEdit(link)}
                  className="p-1 text-plum-700 hover:text-bordeaux-800"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteSocialLink(link.id)}
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
