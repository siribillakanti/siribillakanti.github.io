import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload, Trash2, Copy, Lock, Unlock, Eye, EyeOff,
  ArrowUp, ArrowDown, RotateCcw, RotateCw, Plus, X,
  Undo2, Redo2, Layers, Image as ImageIcon, Move,
  ZoomIn, ZoomOut, Save, Sparkles
} from 'lucide-react';
import DOMPurify from 'dompurify';
import type {
  StickerAsset, PlacedSticker, StickerPageId, StickerEditorState
} from '../../../types/sticker';
import { STICKER_PAGES } from '../../../types/sticker';
import { processImageFile } from '../../../utils/imageStorage';

const STORAGE_KEY = 'siri_portfolio_stickers_v1';

function loadStickerState(): StickerEditorState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        library: parsed.library || [],
        layouts: {
          homepage: parsed.layouts?.homepage || [],
          about: parsed.layouts?.about || [],
          projects: parsed.layouts?.projects || [],
          credentials: parsed.layouts?.credentials || [],
          achievements: parsed.layouts?.achievements || [],
          certifications: parsed.layouts?.certifications || [],
          contact: parsed.layouts?.contact || [],
        },
        selectedStickerId: null,
        undoStack: [],
        redoStack: [],
      };
    }
  } catch (e) { /* ignore */ }
  return {
    library: [],
    layouts: {
      homepage: [], about: [], projects: [], credentials: [],
      achievements: [], certifications: [], contact: [],
    },
    selectedStickerId: null,
    undoStack: [],
    redoStack: [],
  };
}

function saveStickerState(state: StickerEditorState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      library: state.library,
      layouts: state.layouts,
    }));
    window.dispatchEvent(new Event('stickersUpdated'));
  } catch (e) {
    console.warn('Failed to save sticker state:', e);
  }
}

function sanitizeSVG(svgString: string): string {
  return DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'pattern', 'mask', 'clipPath'],
    FORBID_TAGS: ['script', 'style'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover'],
  });
}

export const StickerEditor: React.FC = () => {
  const [state, setState] = useState<StickerEditorState>(loadStickerState);
  const [activePage, setActivePage] = useState<StickerPageId>('homepage');
  const [showLibrary, setShowLibrary] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStickerRef = useRef<string | null>(null);

  const currentStickers = state.layouts[activePage] || [];
  const selectedSticker = currentStickers.find(s => s.id === state.selectedStickerId) || null;

  // Persist on change
  useEffect(() => {
    saveStickerState(state);
  }, [state.library, state.layouts]);

  const pushUndo = useCallback(() => {
    setState(prev => ({
      ...prev,
      undoStack: [...prev.undoStack.slice(-30), [...(prev.layouts[activePage] || [])]],
      redoStack: [],
    }));
  }, [activePage]);

  const handleUndo = () => {
    setState(prev => {
      if (prev.undoStack.length === 0) return prev;
      const undoStack = [...prev.undoStack];
      const previous = undoStack.pop()!;
      return {
        ...prev,
        undoStack,
        redoStack: [...prev.redoStack, [...(prev.layouts[activePage] || [])]],
        layouts: { ...prev.layouts, [activePage]: previous },
        selectedStickerId: null,
      };
    });
  };

  const handleRedo = () => {
    setState(prev => {
      if (prev.redoStack.length === 0) return prev;
      const redoStack = [...prev.redoStack];
      const next = redoStack.pop()!;
      return {
        ...prev,
        redoStack,
        undoStack: [...prev.undoStack, [...(prev.layouts[activePage] || [])]],
        layouts: { ...prev.layouts, [activePage]: next },
        selectedStickerId: null,
      };
    });
  };

  // Upload sticker to library
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isSvg = ext === 'svg' || file.type === 'image/svg+xml';
      const isPng = ext === 'png' || file.type === 'image/png';
      const isWebp = ext === 'webp' || file.type === 'image/webp';

      if (!isSvg && !isPng && !isWebp) {
        continue; // skip unsupported formats
      }

      let url: string;
      let format: 'png' | 'webp' | 'svg' = isPng ? 'png' : isWebp ? 'webp' : 'svg';

      if (isSvg) {
        const text = await file.text();
        const sanitized = sanitizeSVG(text);
        url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(sanitized)))}`;
      } else {
        url = await processImageFile(file, 800, 800, 0.9);
      }

      const asset: StickerAsset = {
        id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        url,
        format,
        thumbnailUrl: url,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        library: [...prev.library, asset],
      }));
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteAsset = (assetId: string) => {
    setState(prev => {
      const newLayouts = { ...prev.layouts };
      (Object.keys(newLayouts) as StickerPageId[]).forEach(page => {
        newLayouts[page] = newLayouts[page].filter(s => s.assetId !== assetId);
      });
      return {
        ...prev,
        library: prev.library.filter(a => a.id !== assetId),
        layouts: newLayouts,
        selectedStickerId: null,
      };
    });
  };

  // Place sticker from library onto canvas
  const placeSticker = (asset: StickerAsset) => {
    pushUndo();
    const placed: PlacedSticker = {
      id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      assetId: asset.id,
      url: asset.url,
      xPercent: 40 + Math.random() * 20,
      yPercent: 30 + Math.random() * 20,
      scale: 1,
      rotation: 0,
      baseWidth: 80,
      baseHeight: 80,
      zIndex: currentStickers.length + 1,
      locked: false,
      visible: true,
      animation: 'none',
      floatSpeed: 5,
      parallaxFactor: 10,
      opacity: 1,
    };

    setState(prev => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: [...(prev.layouts[activePage] || []), placed],
      },
      selectedStickerId: placed.id,
    }));
  };

  const updateSticker = (id: string, updates: Partial<PlacedSticker>) => {
    setState(prev => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: (prev.layouts[activePage] || []).map(s =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
    }));
  };

  const deleteSticker = (id: string) => {
    pushUndo();
    setState(prev => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: (prev.layouts[activePage] || []).filter(s => s.id !== id),
      },
      selectedStickerId: prev.selectedStickerId === id ? null : prev.selectedStickerId,
    }));
  };

  const duplicateSticker = (id: string) => {
    pushUndo();
    const original = currentStickers.find(s => s.id === id);
    if (!original) return;
    const dup: PlacedSticker = {
      ...original,
      id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      xPercent: original.xPercent + 3,
      yPercent: original.yPercent + 3,
      zIndex: currentStickers.length + 1,
      locked: false,
    };
    setState(prev => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [activePage]: [...(prev.layouts[activePage] || []), dup],
      },
      selectedStickerId: dup.id,
    }));
  };

  const bringForward = (id: string) => {
    pushUndo();
    setState(prev => {
      const stickers = [...(prev.layouts[activePage] || [])];
      const idx = stickers.findIndex(s => s.id === id);
      if (idx < 0 || idx >= stickers.length - 1) return prev;
      [stickers[idx], stickers[idx + 1]] = [stickers[idx + 1], stickers[idx]];
      return {
        ...prev,
        layouts: {
          ...prev.layouts,
          [activePage]: stickers.map((s, i) => ({ ...s, zIndex: i + 1 })),
        },
      };
    });
  };

  const sendBackward = (id: string) => {
    pushUndo();
    setState(prev => {
      const stickers = [...(prev.layouts[activePage] || [])];
      const idx = stickers.findIndex(s => s.id === id);
      if (idx <= 0) return prev;
      [stickers[idx], stickers[idx - 1]] = [stickers[idx - 1], stickers[idx]];
      return {
        ...prev,
        layouts: {
          ...prev.layouts,
          [activePage]: stickers.map((s, i) => ({ ...s, zIndex: i + 1 })),
        },
      };
    });
  };

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent, stickerId: string) => {
    const sticker = currentStickers.find(s => s.id === stickerId);
    if (!sticker || sticker.locked) return;

    e.preventDefault();
    e.stopPropagation();
    
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    setIsDragging(true);
    dragStickerRef.current = stickerId;
    setDragOffset({
      x: e.clientX - (sticker.xPercent / 100 * rect.width),
      y: e.clientY - (sticker.yPercent / 100 * rect.height),
    });

    setState(prev => ({ ...prev, selectedStickerId: stickerId }));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      if (!canvasRef.current || !dragStickerRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - dragOffset.x) / rect.width) * 100;
      const y = ((e.clientY - dragOffset.y) / rect.height) * 100;
      updateSticker(dragStickerRef.current, {
        xPercent: Math.max(-10, Math.min(110, x)),
        yPercent: Math.max(-10, Math.min(110, y)),
      });
    };

    const handleUp = () => {
      if (dragStickerRef.current) {
        pushUndo();
      }
      setIsDragging(false);
      dragStickerRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragOffset, pushUndo]);

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-5 shadow-card">
        <div>
          <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
            Visual Customizer
          </h3>
          <p className="font-sans text-xs text-plum-700 mt-0.5">
            Upload stickers and decorative images. Drag, resize, and arrange them on each page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={state.undoStack.length === 0}
            className="p-2 bg-ivory-200 hover:bg-ivory-300 rounded-lg border border-plum-900/20 disabled:opacity-30"
            title="Undo"
          >
            <Undo2 className="w-4 h-4 text-plum-900" />
          </button>
          <button
            onClick={handleRedo}
            disabled={state.redoStack.length === 0}
            className="p-2 bg-ivory-200 hover:bg-ivory-300 rounded-lg border border-plum-900/20 disabled:opacity-30"
            title="Redo"
          >
            <Redo2 className="w-4 h-4 text-plum-900" />
          </button>
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-xs font-bold transition-all ${
              showLibrary
                ? 'bg-bordeaux-800 text-ivory-100 border-plum-900'
                : 'bg-ivory-200 text-plum-900 border-plum-900/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Library
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2">
        {STICKER_PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => {
              setActivePage(page.id);
              setState(prev => ({ ...prev, selectedStickerId: null, undoStack: [], redoStack: [] }));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all ${
              activePage === page.id
                ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-card'
                : 'bg-ivory-50 text-plum-800 border-plum-900/20 hover:bg-butter-300'
            }`}
          >
            {page.label}
            {(state.layouts[page.id]?.length || 0) > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-butter-300 text-plum-900 rounded text-[10px]">
                {state.layouts[page.id].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Library Panel */}
        {showLibrary && (
          <div className="w-full lg:w-72 flex-shrink-0 bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-4 shadow-card space-y-4 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-bordeaux-800">
                Sticker Library ({state.library.length})
              </h4>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-lg border border-plum-900"
              >
                <Upload className="w-3 h-3 text-butter-300" />
                Upload
              </button>
            </div>

            <p className="text-[11px] font-mono text-plum-500">
              PNG, WebP, SVG. Click a sticker to place it on the canvas.
            </p>

            {state.library.length === 0 && (
              <div className="p-6 text-center bg-ivory-100 rounded-xl border border-dashed border-plum-900/20">
                <ImageIcon className="w-8 h-8 text-plum-500 mx-auto mb-2" />
                <p className="text-xs text-plum-600 font-mono">No stickers yet</p>
                <p className="text-[11px] text-plum-500 mt-1">Upload PNG, WebP, or SVG files</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {state.library.map(asset => (
                <div
                  key={asset.id}
                  className="group relative aspect-square bg-ivory-100 border border-plum-900/20 rounded-lg overflow-hidden cursor-pointer hover:border-bordeaux-800 hover:shadow-md transition-all"
                  onClick={() => placeSticker(asset)}
                  title={`Place "${asset.name}"`}
                >
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.name}
                    className="w-full h-full object-contain p-1"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAsset(asset.id);
                    }}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from library"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-plum-900/80 px-1 py-0.5 text-[9px] text-ivory-100 font-mono truncate">
                    {asset.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 space-y-4">
          <div
            ref={canvasRef}
            className="relative w-full bg-ivory-100 border-2 border-dashed border-plum-900/30 rounded-card-lg overflow-hidden"
            style={{ minHeight: 420, aspectRatio: '16/9' }}
            onClick={() => setState(prev => ({ ...prev, selectedStickerId: null }))}
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#2A102A 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Page label */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-plum-900/80 text-ivory-100 font-mono text-[10px] font-bold rounded-lg uppercase tracking-wider z-10">
              {STICKER_PAGES.find(p => p.id === activePage)?.label} Canvas
            </div>

            {/* Placed stickers */}
            {currentStickers.map(sticker => (
              <div
                key={sticker.id}
                className={`absolute cursor-move select-none transition-shadow ${
                  state.selectedStickerId === sticker.id
                    ? 'ring-2 ring-bordeaux-800 ring-offset-2 shadow-lg'
                    : 'hover:ring-1 hover:ring-plum-900/40'
                } ${sticker.locked ? 'cursor-not-allowed' : ''}`}
                style={{
                  left: `${sticker.xPercent}%`,
                  top: `${sticker.yPercent}%`,
                  width: sticker.baseWidth * sticker.scale,
                  height: sticker.baseHeight * sticker.scale,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                  zIndex: sticker.zIndex,
                  opacity: sticker.visible ? sticker.opacity : 0.3,
                }}
                onMouseDown={(e) => handleMouseDown(e, sticker.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setState(prev => ({ ...prev, selectedStickerId: sticker.id }));
                }}
              >
                <img
                  src={sticker.url}
                  alt=""
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
                {sticker.locked && (
                  <div className="absolute top-0 right-0 p-0.5 bg-plum-900/80 rounded-bl">
                    <Lock className="w-2.5 h-2.5 text-butter-300" />
                  </div>
                )}
              </div>
            ))}

            {currentStickers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-plum-500">
                <Sparkles className="w-10 h-10 mb-2 opacity-40" />
                <p className="font-mono text-xs">No stickers on this page</p>
                <p className="font-mono text-[11px] mt-1 text-plum-400">
                  Click a sticker from the library to place it
                </p>
              </div>
            )}
          </div>

          {/* Selected Sticker Controls */}
          {selectedSticker && (
            <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-4 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-bordeaux-800">
                  Sticker Properties
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => duplicateSticker(selectedSticker.id)}
                    className="p-1.5 bg-ivory-200 hover:bg-ivory-300 rounded border border-plum-900/20"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5 text-plum-800" />
                  </button>
                  <button
                    onClick={() => updateSticker(selectedSticker.id, { locked: !selectedSticker.locked })}
                    className="p-1.5 bg-ivory-200 hover:bg-ivory-300 rounded border border-plum-900/20"
                    title={selectedSticker.locked ? 'Unlock' : 'Lock'}
                  >
                    {selectedSticker.locked ? (
                      <Lock className="w-3.5 h-3.5 text-bordeaux-800" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-plum-800" />
                    )}
                  </button>
                  <button
                    onClick={() => updateSticker(selectedSticker.id, { visible: !selectedSticker.visible })}
                    className="p-1.5 bg-ivory-200 hover:bg-ivory-300 rounded border border-plum-900/20"
                    title={selectedSticker.visible ? 'Hide' : 'Show'}
                  >
                    {selectedSticker.visible ? (
                      <Eye className="w-3.5 h-3.5 text-plum-800" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-plum-800" />
                    )}
                  </button>
                  <button
                    onClick={() => sendBackward(selectedSticker.id)}
                    className="p-1.5 bg-ivory-200 hover:bg-ivory-300 rounded border border-plum-900/20"
                    title="Send Backward"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-plum-800" />
                  </button>
                  <button
                    onClick={() => bringForward(selectedSticker.id)}
                    className="p-1.5 bg-ivory-200 hover:bg-ivory-300 rounded border border-plum-900/20"
                    title="Bring Forward"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-plum-800" />
                  </button>
                  <button
                    onClick={() => deleteSticker(selectedSticker.id)}
                    className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded border border-red-300"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Position X */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">X Position</label>
                  <input
                    type="range" min={-10} max={110} step={0.5}
                    value={selectedSticker.xPercent}
                    onChange={(e) => { pushUndo(); updateSticker(selectedSticker.id, { xPercent: parseFloat(e.target.value) }); }}
                    className="w-full accent-bordeaux-800"
                  />
                  <span className="font-mono text-[10px] text-plum-500">{selectedSticker.xPercent.toFixed(1)}%</span>
                </div>

                {/* Position Y */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Y Position</label>
                  <input
                    type="range" min={-10} max={110} step={0.5}
                    value={selectedSticker.yPercent}
                    onChange={(e) => { pushUndo(); updateSticker(selectedSticker.id, { yPercent: parseFloat(e.target.value) }); }}
                    className="w-full accent-bordeaux-800"
                  />
                  <span className="font-mono text-[10px] text-plum-500">{selectedSticker.yPercent.toFixed(1)}%</span>
                </div>

                {/* Scale */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Scale</label>
                  <input
                    type="range" min={0.1} max={3} step={0.05}
                    value={selectedSticker.scale}
                    onChange={(e) => { pushUndo(); updateSticker(selectedSticker.id, { scale: parseFloat(e.target.value) }); }}
                    className="w-full accent-bordeaux-800"
                  />
                  <span className="font-mono text-[10px] text-plum-500">{selectedSticker.scale.toFixed(2)}×</span>
                </div>

                {/* Rotation */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Rotation</label>
                  <input
                    type="range" min={-180} max={180} step={1}
                    value={selectedSticker.rotation}
                    onChange={(e) => { pushUndo(); updateSticker(selectedSticker.id, { rotation: parseFloat(e.target.value) }); }}
                    className="w-full accent-bordeaux-800"
                  />
                  <span className="font-mono text-[10px] text-plum-500">{selectedSticker.rotation}°</span>
                </div>
              </div>

              {/* Animation + Opacity */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Animation</label>
                  <select
                    value={selectedSticker.animation}
                    onChange={(e) => updateSticker(selectedSticker.id, { animation: e.target.value as PlacedSticker['animation'] })}
                    className="w-full px-2 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg font-mono text-xs"
                  >
                    <option value="none">None</option>
                    <option value="float">Float</option>
                    <option value="parallax">Parallax</option>
                  </select>
                </div>

                {selectedSticker.animation === 'float' && (
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold text-plum-700">Float Speed</label>
                    <input
                      type="range" min={2} max={12} step={0.5}
                      value={selectedSticker.floatSpeed}
                      onChange={(e) => updateSticker(selectedSticker.id, { floatSpeed: parseFloat(e.target.value) })}
                      className="w-full accent-bordeaux-800"
                    />
                    <span className="font-mono text-[10px] text-plum-500">{selectedSticker.floatSpeed}s</span>
                  </div>
                )}

                {selectedSticker.animation === 'parallax' && (
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold text-plum-700">Parallax Factor</label>
                    <input
                      type="range" min={2} max={30} step={1}
                      value={selectedSticker.parallaxFactor}
                      onChange={(e) => updateSticker(selectedSticker.id, { parallaxFactor: parseFloat(e.target.value) })}
                      className="w-full accent-bordeaux-800"
                    />
                    <span className="font-mono text-[10px] text-plum-500">{selectedSticker.parallaxFactor}px</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Opacity</label>
                  <input
                    type="range" min={0.1} max={1} step={0.05}
                    value={selectedSticker.opacity}
                    onChange={(e) => updateSticker(selectedSticker.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full accent-bordeaux-800"
                  />
                  <span className="font-mono text-[10px] text-plum-500">{Math.round(selectedSticker.opacity * 100)}%</span>
                </div>
              </div>

              {/* Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Base Width (px)</label>
                  <input
                    type="number" min={20} max={400} step={5}
                    value={selectedSticker.baseWidth}
                    onChange={(e) => updateSticker(selectedSticker.id, { baseWidth: parseInt(e.target.value) || 80 })}
                    className="w-full px-2 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-bold text-plum-700">Base Height (px)</label>
                  <input
                    type="number" min={20} max={400} step={5}
                    value={selectedSticker.baseHeight}
                    onChange={(e) => updateSticker(selectedSticker.id, { baseHeight: parseInt(e.target.value) || 80 })}
                    className="w-full px-2 py-1.5 bg-ivory-100 border border-plum-900/30 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sticker count info */}
          <div className="text-xs font-mono text-plum-500 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            {currentStickers.length} sticker{currentStickers.length !== 1 ? 's' : ''} on {STICKER_PAGES.find(p => p.id === activePage)?.label}
            {currentStickers.filter(s => !s.visible).length > 0 && (
              <span className="text-amber-700">
                ({currentStickers.filter(s => !s.visible).length} hidden)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
