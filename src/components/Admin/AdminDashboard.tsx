import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  FolderKanban, 
  User, 
  Sparkles, 
  GraduationCap, 
  Award, 
  FileText, 
  Mail, 
  Settings, 
  LayoutDashboard, 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Lock, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  Type,
  Sliders,
  Globe,
  BookOpen,
  Loader2
} from 'lucide-react';

import { OverviewEditor } from './editors/OverviewEditor';
import { ProfileEditor } from './editors/ProfileEditor';
import { AboutEditor } from './editors/AboutEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { EducationExperienceEditor } from './editors/EducationExperienceEditor';
import { CredentialsEditor } from './editors/CredentialsEditor';
import { ResumeEditor } from './editors/ResumeEditor';
import { ContactSocialEditor } from './editors/ContactSocialEditor';
import { SettingsEditor } from './editors/SettingsEditor';
import { SectionsEditor } from './editors/SectionsEditor';
import { DecorationsEditor } from './editors/DecorationsEditor';
import { BrandingEditor } from './editors/BrandingEditor';
import { StickerEditor } from './editors/StickerEditor';
import { BrandLogo } from '../Common/BrandLogo';
import { Palette, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type CMSTab = 
  | 'overview' 
  | 'profile' 
  | 'about'
  | 'projects' 
  | 'sections'
  | 'decorations'
  | 'stickers'
  | 'branding'
  | 'skills' 
  | 'education' 
  | 'credentials' 
  | 'resume' 
  | 'contact' 
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    isAdminAuthenticated, 
    loginAdmin, 
    logoutAdmin,
    adminPin,
    hasUnsavedChanges,
    isSaving,
    saveAllChanges,
    discardUnsavedChanges,
    lastSavedTimestamp,
    showToast
  } = usePortfolio();

  const { user, isAdmin, isSupabaseActive, signInWithPassword, signOut: supabaseSignOut } = useAuth();
  const [activeTab, setActiveTab] = useState<CMSTab>('overview');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAdminOpen) return null;

  const isDev = import.meta.env.DEV;

  // In production, authentication is EXCLUSIVELY Supabase Auth with admin UID verification.
  // Local passcode fallback is strictly forbidden in production builds.
  const effectiveIsAuthenticated = isDev
    ? (isSupabaseActive ? isAdmin : isAdminAuthenticated)
    : Boolean(isSupabaseActive && isAdmin);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseActive) {
      setAuthError(null);
      setIsSubmittingAuth(true);
      const res = await signInWithPassword(emailInput, passwordInput);
      setIsSubmittingAuth(false);
      if (!res.success) {
        setAuthError(res.error || 'Authentication failed');
        showToast('Login Failed', res.error || 'Check your credentials.', 'info');
      } else {
        showToast('Access Granted', 'Administrator authenticated with Supabase.', 'success');
      }
    } else if (isDev) {
      loginAdmin(passwordInput);
    } else {
      setAuthError('Local passcode fallback is permanently disabled in production builds. Supabase Auth is required.');
    }
  };

  const handleLogout = async () => {
    if (isSupabaseActive) {
      await supabaseSignOut();
    }
    logoutAdmin();
  };

  const handleBackToWebsite = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      setIsAdminOpen(false);
    }
  };

  const handleConfirmExitDiscard = () => {
    discardUnsavedChanges();
    setShowExitConfirm(false);
    setIsAdminOpen(false);
  };

  const handleConfirmExitSave = async () => {
    const success = await saveAllChanges();
    if (success) {
      setShowExitConfirm(false);
      setIsAdminOpen(false);
    }
  };

  const navItems: { id: CMSTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'about', label: 'About Me Page', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'sections', label: 'Section Headings', icon: Type },
    { id: 'decorations', label: 'Illustrations & Garden', icon: Sliders },
    { id: 'stickers', label: 'Visual Customizer', icon: Palette },
    { id: 'branding', label: 'Branding & Mark', icon: Globe },
    { id: 'skills', label: 'Skills & Tech', icon: Sparkles },
    { id: 'education', label: 'Education & Exp', icon: GraduationCap },
    { id: 'credentials', label: 'Credentials', icon: Award },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'contact', label: 'Contact & Social', icon: Mail },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  // Unauthenticated Lock Screen
  if (!effectiveIsAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-ivory-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-8 shadow-card-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-butter-300 border-2 border-plum-900 shadow-card flex items-center justify-center mx-auto text-bordeaux-800">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-3xl font-bold text-bordeaux-800">
              Portfolio CMS Console
            </h2>
            <p className="font-sans text-xs sm:text-sm text-plum-700 mt-1">
              {isSupabaseActive
                ? 'Sign in with your administrator Supabase credentials.'
                : (isDev
                    ? 'Enter your master passcode to access the local dev dashboard.'
                    : 'The CMS console is protected by Supabase Auth and PostgreSQL RLS.')}
            </p>

            <div className="mt-3 p-2 bg-ivory-200 rounded-lg border border-plum-900/15 text-xs font-mono text-plum-600 flex items-center justify-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-500' : (isDev ? 'bg-amber-500' : 'bg-red-500')}`}></span>
              <span>
                {isSupabaseActive
                  ? 'Supabase Auth & RLS Connected'
                  : (isDev ? 'Local Offline Dev Mode' : 'Supabase Authentication Required')}
              </span>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-mono text-left">
              {authError}
            </div>
          )}

          {(!isSupabaseActive && !isDev) ? (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs font-mono text-amber-900 text-left space-y-2">
              <p className="font-bold">Supabase Credentials Required</p>
              <p className="text-[11px] leading-relaxed">
                Production builds exclusively use Supabase Auth. Please ensure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> are configured in your GitHub repository secrets.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3">
              {isSupabaseActive && (
                <input
                  type="email"
                  required
                  placeholder="admin@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-bordeaux-800"
                  autoFocus
                />
              )}
              <input
                type="password"
                required
                placeholder={isSupabaseActive ? 'Password' : 'Dev Master Passcode'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-bordeaux-800"
                autoFocus={!isSupabaseActive}
              />
              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-sm rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmittingAuth ? 'Authenticating...' : (isSupabaseActive ? 'Sign In as Administrator' : 'Unlock Local Console')}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="text-xs font-mono text-plum-600 hover:text-bordeaux-800 underline block mx-auto"
          >
            ← Return to Public Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-ivory-100 flex flex-col md:flex-row overflow-hidden font-sans text-plum-900 select-none">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-ivory-50 border-r-3 border-plum-900 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-5 border-b-2 border-plum-900/20 bg-ivory-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <BrandLogo size={32} />
                <div>
                  <h1 className="font-serif text-lg font-bold text-bordeaux-800 leading-tight">
                    Siri Billakanti
                  </h1>
                  <span className="font-mono text-[10px] text-plum-500 uppercase tracking-widest block font-bold">
                    PORTFOLIO CMS
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden p-1 text-plum-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Storage Health Pill */}
            <div className="mt-3 px-2.5 py-1 bg-pistachio-300/40 border border-pistachio-600 rounded-md text-[10px] font-mono text-plum-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${isSupabaseActive ? 'bg-emerald-600' : 'bg-pistachio-600'}`}></span>
                {isSupabaseActive ? 'Supabase RLS Active' : 'IndexedDB Active'}
              </span>
              <span className="text-plum-600">{isSupabaseActive ? 'Postgres' : 'v2.0'}</span>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all text-left border ${
                    isActive
                      ? 'bg-bordeaux-800 text-ivory-100 font-bold border-plum-900 shadow-sm'
                      : 'text-plum-800 hover:bg-butter-300/60 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-butter-300' : 'text-bordeaux-800'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t-2 border-plum-900/15 bg-ivory-100 space-y-2">
          {/* Back to Website Button */}
          <button
            type="button"
            onClick={handleBackToWebsite}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-butter-300 hover:bg-butter-400 text-plum-900 font-sans font-bold text-xs rounded-xl border-2 border-plum-900 shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </button>

          {/* Logout Lock Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs font-mono text-plum-600 hover:text-red-700 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b-2 border-plum-900/20 bg-ivory-50 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-ivory-200 text-plum-900 border border-plum-900/20"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-bordeaux-800 leading-tight">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                {hasUnsavedChanges ? (
                  <span className="text-amber-800 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    Unsaved Edits
                  </span>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Saved ({lastSavedTimestamp})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={discardUnsavedChanges}
                className="flex items-center space-x-1 px-3 py-1.5 bg-ivory-200 hover:bg-ivory-300 text-plum-800 font-mono text-xs font-bold rounded-lg border border-plum-900/20 transition-all"
                title="Discard unsaved edits"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Discard</span>
              </button>
            )}

            <button
              type="button"
              disabled={isSaving}
              onClick={saveAllChanges}
              className="flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs sm:text-sm rounded-xl border-2 border-plum-900 shadow-card transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 text-butter-300 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-butter-300" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBackToWebsite}
              className="hidden sm:flex items-center space-x-1 px-3 py-2 bg-ivory-100 hover:bg-butter-300 text-plum-900 font-mono text-xs font-bold rounded-xl border border-plum-900/30 transition-all"
              title="Preview on Public Portfolio"
            >
              <ExternalLink className="w-3.5 h-3.5 text-bordeaux-800" />
              <span>Preview</span>
            </button>
          </div>
        </header>

        {/* Scrollable Editor Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-ivory-100">
          {activeTab === 'overview' && (
            <OverviewEditor 
              onNavigate={(tab) => setActiveTab(tab)} 
              onPreview={handleBackToWebsite} 
            />
          )}
          {activeTab === 'profile' && <ProfileEditor />}
          {activeTab === 'about' && <AboutEditor />}
          {activeTab === 'projects' && <ProjectsEditor />}
          {activeTab === 'sections' && <SectionsEditor />}
          {activeTab === 'decorations' && <DecorationsEditor />}
          {activeTab === 'stickers' && <StickerEditor />}
          {activeTab === 'branding' && <BrandingEditor />}
          {activeTab === 'skills' && <SkillsEditor />}
          {activeTab === 'education' && <EducationExperienceEditor />}
          {activeTab === 'credentials' && <CredentialsEditor />}
          {activeTab === 'resume' && <ResumeEditor />}
          {activeTab === 'contact' && <ContactSocialEditor />}
          {activeTab === 'settings' && <SettingsEditor />}
        </main>
      </div>

      {/* ================= EXIT WITH UNSAVED CHANGES CONFIRMATION ================= */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-plum-950/75 backdrop-blur-sm -z-10" onClick={() => setShowExitConfirm(false)} />
          <div className="w-full max-w-md bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 shadow-card-xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-700">
              <div className="p-3 bg-amber-100 rounded-xl border border-amber-300">
                <AlertCircle className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-bordeaux-800">
                  Unsaved Changes
                </h4>
                <p className="font-mono text-xs text-plum-600">
                  You have edits that haven't been saved to your portfolio yet.
                </p>
              </div>
            </div>

            <p className="text-sm font-sans text-plum-800">
              Would you like to save your changes before returning to the public website, or discard them?
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-2 bg-ivory-200 text-plum-800 font-mono text-xs font-bold rounded-xl border border-plum-900/20"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmExitDiscard}
                className="px-3.5 py-2 bg-ivory-100 hover:bg-red-100 text-red-700 font-mono text-xs font-bold rounded-xl border border-plum-900/20"
              >
                Discard Edits
              </button>
              <button
                type="button"
                onClick={handleConfirmExitSave}
                className="px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs rounded-xl border-2 border-plum-900 shadow-card"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
