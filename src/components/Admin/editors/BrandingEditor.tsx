import React, { useRef, useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { processImageFile } from '../../../utils/imageStorage';
import { BrandLogo } from '../../Common/BrandLogo';
import { 
  Globe, 
  Upload, 
  Trash2, 
  Sparkles, 
  Check, 
  Layout, 
  Layers,
  FileCode
} from 'lucide-react';

export const BrandingEditor: React.FC = () => {
  const { 
    branding, 
    updateBranding, 
    uploadCustomLogo, 
    removeCustomLogo, 
    showToast 
  } = usePortfolio();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please upload an image file (PNG, SVG, JPG).', 'info');
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = await processImageFile(file, 256, 256, 0.95);
      await uploadCustomLogo(dataUrl);
      showToast('Logo Updated', 'Custom logo saved successfully.', 'success');
    } catch (err) {
      showToast('Upload Error', 'Could not process custom logo.', 'info');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header Overview */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Website Branding, Identity & Mark
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Configure your personal brand identity, custom logo/monogram, browser titles, and copyright colophon.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Logo & Monogram Architecture */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h4 className="font-serif text-xl font-bold text-bordeaux-800">
            Personal Mark & Logo Geometry
          </h4>
          <p className="font-sans text-xs text-plum-700 mt-1">
            Displayed in the floating navigation pill, admin console, and browser favicon.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-ivory-200/70 rounded-2xl border border-plum-900/15">
          {/* Logo Visual Live Preview */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 rounded-2xl bg-ivory-50 border-2 border-plum-900 shadow-card flex items-center justify-center p-2">
              <BrandLogo size={56} />
            </div>
            <span className="font-mono text-[10px] text-plum-600 font-bold uppercase tracking-wider">
              Current Mark
            </span>
          </div>

          <div className="space-y-4 flex-1 text-center sm:text-left">
            {/* Logo Style Type Selector */}
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-bold text-plum-800 block">
                Logo Presentation Style:
              </span>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => updateBranding({ ...branding, logoType: 'monogram' })}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                    branding.logoType === 'monogram'
                      ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-sm'
                      : 'bg-ivory-100 text-plum-800 border-plum-900/30 hover:bg-butter-300'
                  }`}
                >
                  Handcrafted Monogram (SB)
                </button>

                <button
                  type="button"
                  onClick={() => updateBranding({ ...branding, logoType: 'customImage' })}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                    branding.logoType === 'customImage'
                      ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-sm'
                      : 'bg-ivory-100 text-plum-800 border-plum-900/30 hover:bg-butter-300'
                  }`}
                >
                  Upload Custom Logo Image
                </button>
              </div>
            </div>

            {/* Custom Monogram Letters (if monogram style) */}
            {branding.logoType === 'monogram' && (
              <div className="space-y-1 max-w-xs">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Monogram Characters
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={branding.monogramText || 'SB'}
                  onChange={(e) => updateBranding({ ...branding, monogramText: e.target.value.toUpperCase() })}
                  className="w-24 px-3 py-1.5 bg-ivory-100 border-2 border-plum-900 rounded-lg font-mono font-bold text-sm text-center focus:outline-none focus:ring-2 focus:ring-bordeaux-800 uppercase"
                />
              </div>
            )}

            {/* Upload Custom Logo (if customImage style) */}
            {branding.logoType === 'customImage' && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-card"
                  >
                    <Upload className="w-3.5 h-3.5 text-butter-300" />
                    <span>{branding.logoImageUrl ? 'Replace Logo' : 'Upload Image Logo'}</span>
                  </button>

                  {branding.logoImageUrl && (
                    <button
                      type="button"
                      onClick={removeCustomLogo}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-ivory-100 hover:bg-red-100 text-red-700 font-mono text-xs font-bold rounded-xl border border-plum-900/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-mono text-plum-600 block">
                  Supported formats: PNG, SVG, JPG (optimized to 256x256 circular badge).
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Titles, Meta & Browser Tab */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h4 className="font-serif text-xl font-bold text-bordeaux-800">
            Browser Titles & SEO Meta Tags
          </h4>
          <p className="font-sans text-xs text-plum-700 mt-1">
            These values appear in your browser window tab, search engines, and bookmark previews.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Website Brand Title *
            </label>
            <input
              type="text"
              value={branding.websiteTitle || ''}
              onChange={(e) => updateBranding({ ...branding, websiteTitle: e.target.value })}
              placeholder="Siri Billakanti"
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Browser Window Tab Title *
            </label>
            <input
              type="text"
              value={branding.browserTabTitle || ''}
              onChange={(e) => updateBranding({ ...branding, browserTabTitle: e.target.value })}
              placeholder="Siri Billakanti | Portfolio"
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-mono text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
            />
            <span className="text-[11px] font-mono text-plum-500">
              Updates the live browser document title immediately upon saving.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Meta Description (Search & Social Previews)
            </label>
            <textarea
              rows={2}
              value={branding.metaDescription || ''}
              onChange={(e) => updateBranding({ ...branding, metaDescription: e.target.value })}
              placeholder="Personal portfolio of Siri Billakanti..."
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs font-bold text-plum-800 block">
              Footer Colophon / Copyright Notice
            </label>
            <input
              type="text"
              value={branding.footerCopyright || ''}
              onChange={(e) => updateBranding({ ...branding, footerCopyright: e.target.value })}
              placeholder="© 2026 Siri Billakanti. Crafted with care, mathematics, and curiosity."
              className="w-full px-3.5 py-2.5 bg-ivory-100 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
