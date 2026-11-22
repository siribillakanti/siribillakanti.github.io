import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Layers,
  Upload,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Scissors,
  Bookmark,
  Check,
  Move
} from 'lucide-react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { StickerPageId, PlacedSticker, StickerAsset } from '../../../types/sticker';
import { processImageFile } from '../../../utils/imageStorage';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

const SCRAPBOOK_PAGES: { id: StickerPageId; title: string; subtitle: string; pageNumber: string }[] = [
  { id: 'homepage', title: 'Hero Studio', subtitle: 'Profile & Garden Canvas', pageNumber: '01' },
  { id: 'about', title: 'About Journal', subtitle: 'Curriculum & Life Dossier', pageNumber: '02' },
  { id: 'projects', title: 'Projects Exhibition', subtitle: 'Code Gallery & Systems', pageNumber: '03' },
  { id: 'credentials', title: 'Honors & Creds', subtitle: 'Certificates & Milestones', pageNumber: '04' },
  { id: 'contact', title: 'Contact Letter', subtitle: 'Editorial Desk & Mailbox', pageNumber: '05' },
];

export const ScrapbookStickerStudio: React.FC = () => {
  const { stickers, updateStickers, showToast } = usePortfolio();
  const [activePage, setActivePage] = useState<StickerPageId>('homepage');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPlaced = stickers?.layouts?.[activePage] || [];
  const selectedSticker = currentPlaced.find((s) => s.id === selectedStickerId) || null;
  const library = stickers?.library || [];

  // Update a single placed sticker
  const handleUpdatePlaced = (id: string, updates: Partial<PlacedSticker>) => {
    updateStickers((prev) => {
      const pageList = prev.layouts[activePage] || [];
      const nextList = pageList.map((s) => (s.id === id ? { ...s, ...updates } : s));
      return {
        ...prev,
        layouts: {
          ...prev.layouts,
          [activePage]: nextList,
        },
      };
    });
  };

  // Place sticker from tray onto active scrapbook page
  const handlePlaceFromTray = (asset: StickerAsset) => {
    const newPlaced: PlacedSticker = {
      id: `scrapbook-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      assetId: asset.id,
      url: asset.url,
      xPercent: 50 + (Math.random() * 20 - 10),
      yPercent: 45 + (Math.random() * 20 - 10),
      scale: 1.0,
      rotation: Math.floor(Math.random() * 16 - 8),
      baseWidth: 100,
      baseHeight: 100,
      zIndex: currentPlaced.length + 1,
      locked: false,
      visible: true,
      animation: 'float',
      floatSpeed: 4.5,
      parallaxFactor: 10,
      opacity: 0.95,
    };

    updateStickers((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: [...(prev.layouts[activePage] || []), newPlaced],
      },
    }));

    setSelectedStickerId(newPlaced.id);
    showToast('Sticker Stamped!', `Added "${asset.name}" to ${activePage} scrapbook page.`, 'success');
  };

  // Delete placed sticker
  const handleDeletePlaced = (id: string) => {
    updateStickers((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: (prev.layouts[activePage] || []).filter((s) => s.id !== id),
      },
    }));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  // Duplicate placed sticker
  const handleDuplicatePlaced = (sticker: PlacedSticker) => {
    const copy: PlacedSticker = {
      ...sticker,
      id: `scrapbook-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      xPercent: Math.min(95, sticker.xPercent + 5),
      yPercent: Math.min(95, sticker.yPercent + 5),
      zIndex: currentPlaced.length + 1,
    };

    updateStickers((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: [...(prev.layouts[activePage] || []), copy],
      },
    }));
    setSelectedStickerId(copy.id);
  };

  // Upload new asset into scrapbook library
  const handleUploadAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        let format: 'png' | 'webp' | 'svg' = ext === 'svg' ? 'svg' : ext === 'webp' ? 'webp' : 'png';
        let url: string;

        if (format === 'svg') {
          const text = await file.text();
          url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
        } else {
          url = await processImageFile(file, 600, 600, 0.9);
        }

        // Try storage upload if logged in
        let finalUrl = url;
        if (isSupabaseConfigured() && supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              const safeName = `stickers/scrapbook-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
              const { error } = await supabase.storage
                .from('portfolio-assets')
                .upload(safeName, file, { cacheControl: '31536000', upsert: true });
              if (!error) {
                const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(safeName);
                if (data?.publicUrl) finalUrl = data.publicUrl;
              }
            }
          } catch {
            // ignore
          }
        }

        const newAsset: StickerAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          url: finalUrl,
          thumbnailUrl: finalUrl,
          format,
          fileSize: file.size,
          createdAt: new Date().toISOString(),
        };

        updateStickers((prev) => ({
          ...prev,
          library: [newAsset, ...(prev.library || [])],
        }));

        showToast('Ephemera Added', `"${newAsset.name}" is now in your scrapbook tray.`, 'success');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-12 pt-10 border-t-3 border-plum-900/20 space-y-6">
      {/* Editorial Scrapbook Header */}
      <div className="relative bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card overflow-hidden">
        {/* Decorative Washi Tape Top Right */}
        <div className="absolute -top-2 right-8 w-24 h-6 bg-butter-300/80 border-l border-r border-dashed border-plum-900/30 transform -rotate-2 shadow-sm pointer-events-none z-10 flex items-center justify-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-plum-900/70 font-bold">SCRAPBOOK</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-butter-300 rounded-full border border-plum-900/30 text-[11px] font-mono font-bold text-plum-900">
              <Scissors className="w-3 h-3 text-bordeaux-800" />
              <span>CREATIVE SCRAPBOOK & STICKER STUDIO</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bordeaux-800">
              Scrapbook Sticker Studio
            </h3>
            <p className="font-sans text-xs sm:text-sm text-plum-700 max-w-xl leading-relaxed">
              Stamp, arrange, and style tactile stickers and artistic ephemera across your portfolio sections. All arrangements sync live to Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml"
              multiple
              onChange={handleUploadAsset}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs rounded-xl border border-plum-900 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-butter-300" />
              <span>{isUploading ? 'Adding...' : 'Add Sticker / Stamp'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrapbook Album Container */}
      <div className="bg-ivory-50 border-3 border-plum-900 rounded-card-lg shadow-card overflow-hidden">
        {/* Scrapbook Page Tabs */}
        <div className="flex flex-wrap border-b-2 border-plum-900/20 bg-ivory-200/50 p-2 gap-1.5">
          {SCRAPBOOK_PAGES.map((page) => {
            const isActive = activePage === page.id;
            const count = (stickers?.layouts?.[page.id] || []).length;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => {
                  setActivePage(page.id);
                  setSelectedStickerId(null);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  isActive
                    ? 'bg-bordeaux-800 text-ivory-100 font-bold border-plum-900 shadow-sm'
                    : 'bg-ivory-50 text-plum-800 hover:bg-butter-200 border-plum-900/10'
                }`}
              >
                <span className="text-[10px] opacity-70">{page.pageNumber}</span>
                <span>{page.title}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-butter-300 text-plum-900' : 'bg-ivory-200 text-plum-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Studio Content Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Miniature Scrapbook Desk / Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-plum-700">
              <span className="font-bold flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-bordeaux-800" />
                {SCRAPBOOK_PAGES.find((p) => p.id === activePage)?.subtitle}
              </span>
              <span>{currentPlaced.length} active sticker{currentPlaced.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Scrapbook Canvas Surface */}
            <div
              className="relative w-full rounded-2xl border-2 border-dashed border-plum-900/30 bg-ivory-100 overflow-hidden shadow-inner flex items-center justify-center"
              style={{ minHeight: 340, aspectRatio: '16/9' }}
              onClick={() => setSelectedStickerId(null)}
            >
              {/* Paper Desk Texture & Stitched Borders */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#2A102A 1.2px, transparent 1.2px)',
                  backgroundSize: '18px 18px',
                }}
              />

              {/* Watermark Section Cue */}
              <div className="absolute inset-x-0 top-3 text-center pointer-events-none">
                <span className="font-mono text-[10px] uppercase tracking-widest text-plum-900/40 font-bold bg-ivory-100/90 px-3 py-1 rounded-full border border-plum-900/10">
                  {SCRAPBOOK_PAGES.find((p) => p.id === activePage)?.title} Visual Layout
                </span>
              </div>

              {currentPlaced.length === 0 && (
                <div className="text-center p-6 space-y-2 pointer-events-none z-10">
                  <Sparkles className="w-8 h-8 text-plum-400 mx-auto" />
                  <p className="font-serif text-sm font-bold text-plum-800">
                    This scrapbook page is blank
                  </p>
                  <p className="font-sans text-xs text-plum-600 max-w-xs">
                    Choose a sticker or stamp from the tray on the right to place it here.
                  </p>
                </div>
              )}

              {/* Render Placed Stickers */}
              {currentPlaced.map((sticker) => {
                const isSelected = selectedStickerId === sticker.id;
                return (
                  <div
                    key={sticker.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(sticker.id);
                    }}
                    className={`absolute cursor-pointer transition-transform select-none ${
                      isSelected
                        ? 'ring-2 ring-bordeaux-800 ring-offset-2 ring-offset-ivory-100 shadow-md'
                        : 'hover:scale-105'
                    } ${!sticker.visible ? 'opacity-40 grayscale' : ''}`}
                    style={{
                      left: `${sticker.xPercent}%`,
                      top: `${sticker.yPercent}%`,
                      width: sticker.baseWidth * sticker.scale * 0.75,
                      height: sticker.baseHeight * sticker.scale * 0.75,
                      transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                      zIndex: sticker.zIndex,
                    }}
                  >
                    <img
                      src={sticker.url}
                      alt="Scrapbook sticker"
                      className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none"
                      draggable={false}
                    />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-bordeaux-800 text-ivory-100 flex items-center justify-center text-[9px] font-bold shadow-sm">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Sticker Controls Bar */}
            {selectedSticker && (
              <div className="p-3 bg-ivory-200/70 border border-plum-900/20 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-bordeaux-800 truncate max-w-[130px]">
                    Sticker Active
                  </span>

                  {/* Rotate Buttons */}
                  <div className="flex items-center gap-1 bg-ivory-50 px-2 py-1 rounded-lg border border-plum-900/10">
                    <span className="text-[10px] text-plum-600">Tilt:</span>
                    <button
                      type="button"
                      onClick={() => handleUpdatePlaced(selectedSticker.id, { rotation: (selectedSticker.rotation - 10) % 360 })}
                      className="hover:text-bordeaux-800 font-bold px-1"
                      title="Rotate counter-clockwise"
                    >
                      ↺
                    </button>
                    <span className="text-plum-900 font-bold">{selectedSticker.rotation}°</span>
                    <button
                      type="button"
                      onClick={() => handleUpdatePlaced(selectedSticker.id, { rotation: (selectedSticker.rotation + 10) % 360 })}
                      className="hover:text-bordeaux-800 font-bold px-1"
                      title="Rotate clockwise"
                    >
                      ↻
                    </button>
                  </div>

                  {/* Scale Controls */}
                  <div className="flex items-center gap-1 bg-ivory-50 px-2 py-1 rounded-lg border border-plum-900/10">
                    <span className="text-[10px] text-plum-600">Size:</span>
                    <button
                      type="button"
                      onClick={() => handleUpdatePlaced(selectedSticker.id, { scale: Math.max(0.4, Number((selectedSticker.scale - 0.1).toFixed(1))) })}
                      className="hover:text-bordeaux-800 font-bold px-1"
                    >
                      -
                    </button>
                    <span className="text-plum-900 font-bold">{selectedSticker.scale.toFixed(1)}x</span>
                    <button
                      type="button"
                      onClick={() => handleUpdatePlaced(selectedSticker.id, { scale: Math.min(2.5, Number((selectedSticker.scale + 0.1).toFixed(1))) })}
                      className="hover:text-bordeaux-800 font-bold px-1"
                    >
                      +
                    </button>
                  </div>

                  {/* Horizontal / Vertical Position Sliders */}
                  <div className="flex items-center gap-2 bg-ivory-50 px-2 py-1 rounded-lg border border-plum-900/10">
                    <span className="text-[10px] text-plum-600">X:</span>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={selectedSticker.xPercent}
                      onChange={(e) => handleUpdatePlaced(selectedSticker.id, { xPercent: Number(e.target.value) })}
                      className="w-16 accent-bordeaux-800 cursor-pointer"
                    />
                    <span className="text-[10px] text-plum-600">Y:</span>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={selectedSticker.yPercent}
                      onChange={(e) => handleUpdatePlaced(selectedSticker.id, { yPercent: Number(e.target.value) })}
                      className="w-16 accent-bordeaux-800 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Actions: Visibility, Duplicate, Delete */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => handleUpdatePlaced(selectedSticker.id, { visible: !selectedSticker.visible })}
                    className={`p-1.5 rounded-lg border ${
                      selectedSticker.visible
                        ? 'bg-ivory-50 text-plum-800 border-plum-900/20 hover:bg-butter-200'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                    title={selectedSticker.visible ? 'Hide from public site' : 'Make visible'}
                  >
                    {selectedSticker.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicatePlaced(selectedSticker)}
                    className="p-1.5 bg-ivory-50 hover:bg-butter-200 text-plum-800 border border-plum-900/20 rounded-lg"
                    title="Duplicate sticker"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePlaced(selectedSticker.id)}
                    className="p-1.5 bg-ivory-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg"
                    title="Remove sticker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ephemera & Sticker Tray (4 cols) */}
          <div className="lg:col-span-4 bg-ivory-100/60 border-2 border-plum-900/20 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase font-bold text-plum-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-bordeaux-800" />
                  Sticker Tray ({library.length})
                </span>
                <span className="text-[10px] font-mono text-plum-500">Click to stamp</span>
              </div>

              {library.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-plum-900/20 rounded-xl bg-ivory-50/70 space-y-2">
                  <Sparkles className="w-6 h-6 text-plum-400 mx-auto" />
                  <p className="font-serif text-xs font-bold text-plum-800">No stickers yet</p>
                  <p className="font-sans text-[11px] text-plum-600">
                    Upload PNG, SVG, or WebP files to add to your tray.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-bordeaux-800 text-ivory-100 text-[10px] font-mono font-bold rounded-lg shadow-sm"
                  >
                    <Upload className="w-3 h-3 text-butter-300" />
                    <span>Upload First Sticker</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto p-1">
                  {library.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handlePlaceFromTray(asset)}
                      className="group relative aspect-square bg-ivory-50 border-2 border-plum-900/20 hover:border-bordeaux-800 rounded-xl p-1.5 flex flex-col items-center justify-center transition-all hover:shadow-card hover:-translate-y-0.5"
                      title={`Stamp "${asset.name}" onto ${activePage}`}
                    >
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.name}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-bordeaux-900/70 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                        <Plus className="w-5 h-5 text-butter-300" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-plum-900/10 text-[11px] font-sans text-plum-600">
              💡 <span className="font-bold text-bordeaux-800">Scrapbook Tip:</span> Placed stickers appear across your public portfolio pages with subtle floating physics. Remember to click <span className="font-bold text-plum-900">"Save Changes"</span> on the top bar to publish them live to Supabase.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
