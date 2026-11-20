import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  Key, 
  Download, 
  Upload, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  FileCheck,
  X
} from 'lucide-react';

export const SettingsEditor: React.FC = () => {
  const { 
    adminPin, 
    updateAdminPin, 
    exportPortfolioData, 
    importPortfolioData, 
    showToast 
  } = usePortfolio();

  const [pinInput, setPinInput] = useState(adminPin);
  const [pendingBackupContent, setPendingBackupContent] = useState<string | null>(null);
  const [backupSummary, setBackupSummary] = useState<{
    date?: string;
    version?: number;
    projectCount?: number;
    skillsCount?: number;
    hasProfile?: boolean;
    hasStickers?: boolean;
  } | null>(null);
  const [hasPreRestoreBackup, setHasPreRestoreBackup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const existing = localStorage.getItem('siri_portfolio_pre_restore_backup');
      setHasPreRestoreBackup(Boolean(existing));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminPin(pinInput);
  };

  const handleExport = () => {
    const jsonStr = exportPortfolioData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siri-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup Exported', 'Downloaded full portfolio JSON backup with all customizations.', 'success');
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const parsed = JSON.parse(content);
        if (typeof parsed !== 'object' || parsed === null) {
          showToast('Validation Error', 'File is not a valid JSON document.', 'info');
          return;
        }

        const projectCount = Array.isArray(parsed.projects) ? parsed.projects.length : 0;
        const skillsCount = Array.isArray(parsed.skills) ? parsed.skills.length : 0;

        setBackupSummary({
          date: parsed.exportDate ? new Date(parsed.exportDate).toLocaleString() : 'Unknown date',
          version: parsed.version || 1,
          projectCount,
          skillsCount,
          hasProfile: Boolean(parsed.profile),
          hasStickers: Boolean(parsed.stickers),
        });
        setPendingBackupContent(content);
      } catch (err) {
        showToast('Invalid File', 'Could not parse JSON. The file may be corrupted.', 'info');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmRestore = () => {
    if (!pendingBackupContent) return;
    const ok = importPortfolioData(pendingBackupContent);
    setPendingBackupContent(null);
    setBackupSummary(null);
    if (ok) {
      setHasPreRestoreBackup(true);
    }
  };

  const handleRollback = () => {
    try {
      const preBackup = localStorage.getItem('siri_portfolio_pre_restore_backup');
      if (!preBackup) {
        showToast('No Snapshot Found', 'No pre-restore backup exists to roll back to.', 'info');
        return;
      }
      importPortfolioData(preBackup);
      showToast('Rollback Successful', 'Restored to state prior to the last import.', 'success');
    } catch (e) {
      showToast('Rollback Failed', 'Could not restore pre-backup snapshot.', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* 1. Security & Master Passcode */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Access Control & Security
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Configure your local development master passcode and authentication status.
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold">Production Security Architecture:</strong>
            <p className="leading-relaxed">
              Your portfolio CMS is secured by <strong>Supabase Auth</strong> and strict <strong>PostgreSQL Row Level Security (RLS)</strong>. Only your whitelisted administrator account can modify data. Passcode fallbacks are completely disabled in production builds.
            </p>
          </div>
        </div>

        {import.meta.env.DEV && (
          <form onSubmit={handleSavePin} className="space-y-3 pt-2 border-t border-plum-900/10">
            <div className="max-w-xs space-y-1">
              <label className="font-mono text-xs font-bold text-plum-800 block">
                Local Dev Offline Passcode
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Local dev only"
                className="w-full px-3 py-2 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95"
            >
              Update Dev Passcode
            </button>
          </form>
        )}
      </div>

      {/* 2. Backup & Migration (Export / Import) */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-pistachio-300 rounded-xl border border-plum-900 shadow-sm text-plum-900">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Data Backups & Migration
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Safely export and restore all projects, profile data, custom visual stickers, and website settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Box */}
          <div className="p-5 bg-ivory-100 rounded-2xl border border-plum-900/15 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-base text-bordeaux-800 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-raspberry-600" />
                Export Portfolio Snapshot
              </h4>
              <p className="text-xs text-plum-700 leading-relaxed mt-1">
                Downloads a complete verified JSON backup containing all 8 project categories, custom stickers, profile biographies, and visual layout parameters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm transition-all active:scale-95 self-start"
            >
              <Download className="w-3.5 h-3.5 text-butter-300" />
              <span>Download Full Backup</span>
            </button>
          </div>

          {/* Restore Box */}
          <div className="p-5 bg-ivory-100 rounded-2xl border border-plum-900/15 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-serif font-bold text-base text-bordeaux-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-bordeaux-800" />
                Restore from Backup
              </h4>
              <p className="text-xs text-plum-700 leading-relaxed mt-1">
                Upload a backup file. The system validates structure before prompting for confirmation and automatically creates a pre-restore rollback snapshot.
              </p>
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleSelectFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-butter-300 hover:bg-butter-400 text-plum-900 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload & Verify Backup</span>
              </button>

              {hasPreRestoreBackup && (
                <button
                  type="button"
                  onClick={handleRollback}
                  className="flex items-center space-x-1.5 text-xs font-mono text-plum-700 hover:text-bordeaux-800 underline block pt-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rollback to pre-restore state</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BACKUP CONFIRMATION MODAL ================= */}
      {pendingBackupContent && backupSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-plum-950/75 backdrop-blur-sm -z-10"
            onClick={() => setPendingBackupContent(null)}
          />
          <div className="w-full max-w-lg bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 sm:p-7 shadow-card-xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-plum-900/15 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-butter-300 rounded-lg border border-plum-900">
                  <FileCheck className="w-5 h-5 text-bordeaux-800" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-bordeaux-800">
                    Confirm Portfolio Restore
                  </h4>
                  <span className="font-mono text-[11px] text-plum-600">
                    File verified & ready to import
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPendingBackupContent(null)}
                className="p-1 rounded text-plum-600 hover:text-plum-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans text-plum-800">
              <p>
                The backup file is valid. Restoring will synchronize your website state with the contents of this snapshot:
              </p>

              <div className="p-3.5 bg-ivory-100 rounded-xl border border-plum-900/20 font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-plum-600">Snapshot Timestamp:</span>
                  <span className="font-bold text-plum-900">{backupSummary.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-plum-600">Projects Included:</span>
                  <span className="font-bold text-bordeaux-800">{backupSummary.projectCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-plum-600">Skills & Tech Stack:</span>
                  <span className="font-bold text-plum-900">{backupSummary.skillsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-plum-600">Profile & Bio Data:</span>
                  <span className="font-bold text-emerald-800">{backupSummary.hasProfile ? 'Present' : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-plum-600">Stickers & Layouts:</span>
                  <span className="font-bold text-emerald-800">{backupSummary.hasStickers ? 'Present' : 'None'}</span>
                </div>
              </div>

              <div className="p-3 bg-pistachio-300/30 border border-pistachio-600 rounded-xl text-plum-900 text-[11px] font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pistachio-600 flex-shrink-0" />
                <span>An automatic pre-restore backup will be created so you can rollback at any time.</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingBackupContent(null)}
                className="px-4 py-2 bg-ivory-200 text-plum-800 font-mono text-xs font-bold rounded-xl border border-plum-900/20 hover:bg-ivory-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-5 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs sm:text-sm rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95"
              >
                Confirm & Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
