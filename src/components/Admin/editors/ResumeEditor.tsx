import React, { useRef } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { saveMediaItem } from '../../../utils/imageStorage';
import { FileText, Upload, Printer, Download, Eye, CheckCircle2, Sparkles } from 'lucide-react';

export const ResumeEditor: React.FC = () => {
  const { profile, updateProfile, setIsResumeOpen, showToast } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        showToast('Resume File Uploaded', `${file.name} saved into browser storage.`, 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      showToast('Upload Failed', 'Could not process resume file.', 'info');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
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
              Configure resume metadata and upload an optional custom PDF version.
            </p>
          </div>
        </div>

        {/* Current State Display */}
        <div className="p-5 bg-ivory-100 rounded-2xl border border-plum-900/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-bold text-raspberry-600 uppercase tracking-widest block">
                ACTIVE RESUME DOSSIER
              </span>
              <div className="font-serif text-xl font-bold text-bordeaux-800">
                {profile.name} — Curriculum Vitae
              </div>
              <p className="font-mono text-xs text-plum-600 mt-0.5">
                Target: {profile.education.period} Software Engineering Recruitment
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-butter-300 hover:bg-butter-400 text-plum-900 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm transition-transform active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Launch Printable Dossier</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-ivory-50 rounded-xl border border-plum-900/10">
              <span className="text-plum-500 block mb-1">SYSTEM MODE:</span>
              <span className="font-bold text-plum-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Dynamic Live Generation
              </span>
            </div>

            <div className="p-3 bg-ivory-50 rounded-xl border border-plum-900/10">
              <span className="text-plum-500 block mb-1">CUSTOM FILE:</span>
              <span className="font-bold text-plum-900 truncate block">
                {profile.resumeFileName || 'Default (Auto-Built)'}
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

        {/* Custom PDF Upload */}
        <div className="p-5 bg-butter-300/30 border-2 border-dashed border-plum-900/30 rounded-2xl space-y-3">
          <h4 className="font-serif text-lg font-bold text-bordeaux-800">
            Upload Standalone Resume File (PDF / DOCX)
          </h4>
          <p className="font-sans text-xs text-plum-700 leading-relaxed">
            By default, your portfolio generates a beautiful, responsive, print-ready HTML resume directly from your live profile and project data. If you have a custom formatted PDF document, you can upload it here to attach it directly.
          </p>

          <div className="pt-2">
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
              <span>Select File from Computer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
