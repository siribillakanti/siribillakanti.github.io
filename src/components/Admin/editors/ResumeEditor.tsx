import React, { useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { saveMediaItem, deleteMediaItem } from '../../../utils/imageStorage';
import {
  FileText,
  Upload,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ResumeEditor: React.FC = () => {
  const { profile, updateProfile, setIsResumeOpen, showToast } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasCustomResume = Boolean(profile.resumeUrl);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        await saveMediaItem('custom_resume_file', dataUrl);
        const now = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        updateProfile({
          ...profile,
          resumeUrl: dataUrl,
          resumeFileName: file.name,
          resumeUploadDate: now,
        });
        showToast('Resume File Uploaded', `${file.name} saved. Click "Save Changes" to publish.`, 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast('Upload Failed', 'Could not process resume file.', 'info');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveCustomResume = async () => {
    try {
      await deleteMediaItem('custom_resume_file');
      updateProfile({
        ...profile,
        resumeUrl: undefined,
        resumeFileName: undefined,
        resumeUploadDate: undefined,
      });
      showToast(
        'Custom Resume Removed',
        'Reverted back to the auto-built interactive dossier. Click "Save Changes" to publish.',
        'info'
      );
    } catch (err) {
      showToast('Error', 'Failed to clear resume file.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-plum-900">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Curriculum Vitae & Resume Manager
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Configure resume presentation, upload your custom PDF document, or revert to the auto-built dossier.
            </p>
          </div>
        </div>

        {/* Current State Display */}
        <div className="p-5 bg-ivory-100 rounded-2xl border border-plum-900/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-bold text-raspberry-600 uppercase tracking-widest block">
                ACTIVE RESUME SOURCE
              </span>
              <div className="font-serif text-xl font-bold text-bordeaux-800">
                {hasCustomResume
                  ? (profile.resumeFileName || 'Custom Uploaded Resume')
                  : `${profile.name} — Curriculum Vitae (Auto-Built)`}
              </div>
              <p className="font-mono text-xs text-plum-600 mt-0.5">
                {hasCustomResume
                  ? `Uploaded on ${profile.resumeUploadDate || 'Recent'} • Overrides default dossier on public site`
                  : `Target: ${profile.education.period} Software Engineering Recruitment • Dynamically assembled`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-butter-300 hover:bg-butter-400 text-plum-900 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm transition-transform active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Public Viewer</span>
              </button>

              {hasCustomResume && (
                <button
                  type="button"
                  onClick={handleRemoveCustomResume}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-mono text-xs font-bold rounded-xl border border-rose-400 shadow-sm transition-transform active:scale-95"
                  title="Remove uploaded resume and revert to auto-built dossier"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-700" />
                  <span>Remove Custom Resume</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-ivory-50 rounded-xl border border-plum-900/10">
              <span className="text-plum-500 block mb-1">SYSTEM MODE:</span>
              <span className="font-bold text-plum-900 flex items-center gap-1">
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasCustomResume ? 'text-emerald-700' : 'text-bordeaux-700'}`} />
                {hasCustomResume ? 'Custom PDF Active' : 'Dynamic Live Generation'}
              </span>
            </div>

            <div className="p-3 bg-ivory-50 rounded-xl border border-plum-900/10">
              <span className="text-plum-500 block mb-1">ATTACHED FILE:</span>
              <span className="font-bold text-plum-900 truncate block">
                {profile.resumeFileName || 'Default (Auto-Built Dossier)'}
              </span>
            </div>

            <div className="p-3 bg-ivory-50 rounded-xl border border-plum-900/10">
              <span className="text-plum-500 block mb-1">LAST SYNCED:</span>
              <span className="font-bold text-plum-900">
                {profile.resumeUploadDate || 'Current Cycle'}
              </span>
            </div>
          </div>
        </div>

        {/* Custom PDF Upload / Replace */}
        <div className="p-5 bg-butter-300/30 border-2 border-dashed border-plum-900/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-bold text-bordeaux-800">
              {hasCustomResume ? 'Replace Uploaded Resume File' : 'Upload Standalone Resume File (PDF / DOCX)'}
            </h4>
            {hasCustomResume && (
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-300">
                Custom File Attached
              </span>
            )}
          </div>

          <p className="font-sans text-xs text-plum-700 leading-relaxed">
            By default, your portfolio generates an elegant, print-ready HTML resume dossier directly from your live profile and project records.
            When you upload your own custom PDF here, the public viewer will display your uploaded document directly, with a download button and a toggle to the auto-built dossier.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-butter-300" />
              <span>{hasCustomResume ? 'Upload Different File' : 'Select File from Computer'}</span>
            </button>

            {hasCustomResume && (
              <button
                type="button"
                onClick={handleRemoveCustomResume}
                className="flex items-center space-x-1.5 px-4 py-2 bg-ivory-50 hover:bg-rose-50 text-rose-800 font-mono text-xs font-bold rounded-xl border-2 border-rose-300 transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Revert to Auto-Built Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
