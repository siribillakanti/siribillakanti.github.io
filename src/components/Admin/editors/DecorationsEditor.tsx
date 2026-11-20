import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { DetailedDecorationsConfig, DecorationItemConfig } from '../../../types/portfolio';
import { 
  Palette, 
  Move, 
  RotateCw, 
  Gauge, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Flower2, 
  Camera, 
  Cpu, 
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';

export const DecorationsEditor: React.FC = () => {
  const { detailedDecorations, updateDetailedDecorations, showToast } = usePortfolio();
  const [selectedKey, setSelectedKey] = useState<keyof DetailedDecorationsConfig>('wordle');

  const objectsList: { id: keyof DetailedDecorationsConfig; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'wordle', label: 'Wordle Tiles', icon: Sparkles },
    { id: 'callaLily', label: 'Burgundy Calla Lily', icon: Flower2 },
    { id: 'tigerLily1', label: 'Tiger Lily Bloom', icon: Flower2 },
    { id: 'tigerLily2', label: 'Tiger Lily Bud', icon: Flower2 },
    { id: 'pacman', label: 'Pac-Man Arcade', icon: Sparkles },
    { id: 'vintageCamera', label: 'Vintage 35mm Camera', icon: Camera },
    { id: 'instantCamera', label: 'Retro Instant Camera', icon: Camera },
    { id: 'orchid', label: 'Magenta Orchid', icon: Flower2 },
    { id: 'microchip', label: 'Silicon Microchip', icon: Cpu },
  ];

  const currentItem: DecorationItemConfig = detailedDecorations[selectedKey] || {
    visible: true,
    xPercent: 10,
    yPercent: 10,
    scale: 1.0,
    rotation: 0,
    floatSpeed: 5.0,
    enableFloating: true,
  };

  const handleUpdateCurrent = (updates: Partial<DecorationItemConfig>) => {
    updateDetailedDecorations({
      ...detailedDecorations,
      [selectedKey]: {
        ...currentItem,
        ...updates,
      },
    });
  };

  // Wordle letters and colors helper
  const wordleLetters = currentItem.wordleLetters || ['S', 'I', 'R', 'I'];
  const wordleColors = currentItem.wordleColors || ['#538D4E', '#B59F3B', '#538D4E', '#538D4E'];

  const handleWordleLetterChange = (idx: number, letter: string) => {
    const next = [...wordleLetters];
    next[idx] = letter.slice(-1).toUpperCase() || ' ';
    handleUpdateCurrent({ wordleLetters: next });
  };

  const handleWordleColorToggle = (idx: number) => {
    // Toggle between Wordle Green (#538D4E) and Wordle Yellow (#B59F3B) and Deep Plum (#3D153E)
    const colorCycle = ['#538D4E', '#B59F3B', '#3D153E', '#C72C61'];
    const current = wordleColors[idx] || '#538D4E';
    const nextIdx = (colorCycle.indexOf(current) + 1) % colorCycle.length;
    const next = [...wordleColors];
    next[idx] = colorCycle[nextIdx];
    handleUpdateCurrent({ wordleColors: next });
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header Overview */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center space-x-3 pb-2 border-b-2 border-plum-900/15">
          <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
              Illustrations & Visual Arrangement Editor
            </h3>
            <p className="font-sans text-xs text-plum-700">
              Visually arrange and configure the floating botanical and technical illustrations around the homepage profile card.
            </p>
          </div>
        </div>

        {/* Object Selection Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {objectsList.map((obj) => {
            const Icon = obj.icon;
            const isSelected = selectedKey === obj.id;
            const isVisible = detailedDecorations[obj.id]?.visible !== false;
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => setSelectedKey(obj.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-bordeaux-800 text-ivory-100 border-plum-900 shadow-sm'
                    : 'bg-ivory-100 text-plum-800 border-plum-900/20 hover:bg-butter-300/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-butter-300' : 'text-bordeaux-800'}`} />
                <span>{obj.label}</span>
                {!isVisible && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Hidden" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Controls for Selected Object */}
      <div className="bg-ivory-50 border-2 border-plum-900 rounded-card-lg p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-plum-900/15 pb-3">
          <div className="flex items-center space-x-2">
            <h4 className="font-serif text-xl font-bold text-bordeaux-800">
              {objectsList.find((o) => o.id === selectedKey)?.label}
            </h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              currentItem.visible ? 'bg-pistachio-300 text-plum-900' : 'bg-red-100 text-red-700'
            }`}>
              {currentItem.visible ? 'VISIBLE' : 'HIDDEN'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleUpdateCurrent({ visible: !currentItem.visible })}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
              currentItem.visible
                ? 'bg-ivory-100 hover:bg-red-100 text-red-700 border-red-300'
                : 'bg-pistachio-300 hover:bg-pistachio-400 text-plum-900 border-plum-900'
            }`}
          >
            {currentItem.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{currentItem.visible ? 'Hide Object' : 'Show Object'}</span>
          </button>
        </div>

        {/* Wordle-Specific Tile Configuration */}
        {selectedKey === 'wordle' && (
          <div className="p-4 bg-ivory-200/80 rounded-2xl border border-plum-900/15 space-y-3">
            <span className="font-mono text-xs font-bold text-plum-900 block">
              Wordle Letters & Tile Accent Colors:
            </span>
            <div className="flex items-center space-x-3">
              {wordleLetters.map((l, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1.5">
                  <input
                    type="text"
                    maxLength={1}
                    value={l}
                    onChange={(e) => handleWordleLetterChange(idx, e.target.value)}
                    className="w-10 h-11 text-center font-mono font-black text-lg text-ivory-100 rounded-lg border-2 border-plum-900 focus:outline-none shadow-sm cursor-text uppercase"
                    style={{ backgroundColor: wordleColors[idx] || '#538D4E' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleWordleColorToggle(idx)}
                    className="text-[10px] font-mono text-plum-700 hover:text-bordeaux-800 underline"
                    title="Click to cycle color"
                  >
                    Color ↻
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-mono text-plum-600">
              Click "Color ↻" beneath any tile to cycle between Wordle Green, Wordle Yellow, Plum, and Raspberry.
            </p>
          </div>
        )}

        {/* Position & Scale Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Horizontal Position (X%) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-plum-800">Horizontal Position (X)</span>
              <span className="text-bordeaux-800 font-bold">{currentItem.xPercent}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="115"
              step="1"
              value={currentItem.xPercent}
              onChange={(e) => handleUpdateCurrent({ xPercent: Number(e.target.value) })}
              className="w-full accent-bordeaux-800 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-plum-500">
              Relative to the central profile card (-20% left to 115% right)
            </span>
          </div>

          {/* Vertical Position (Y%) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-plum-800">Vertical Position (Y)</span>
              <span className="text-bordeaux-800 font-bold">{currentItem.yPercent}%</span>
            </div>
            <input
              type="range"
              min="-30"
              max="115"
              step="1"
              value={currentItem.yPercent}
              onChange={(e) => handleUpdateCurrent({ yPercent: Number(e.target.value) })}
              className="w-full accent-bordeaux-800 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-plum-500">
              Relative to the central profile card (-30% top to 115% bottom)
            </span>
          </div>

          {/* Size / Scale */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-plum-800">Size / Scale</span>
              <span className="text-bordeaux-800 font-bold">{currentItem.scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={currentItem.scale}
              onChange={(e) => handleUpdateCurrent({ scale: Number(e.target.value) })}
              className="w-full accent-bordeaux-800 cursor-pointer"
            />
          </div>

          {/* Rotation (Degrees) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-plum-800">Tilt Angle (Degrees)</span>
              <span className="text-bordeaux-800 font-bold">{currentItem.rotation}°</span>
            </div>
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={currentItem.rotation}
              onChange={(e) => handleUpdateCurrent({ rotation: Number(e.target.value) })}
              className="w-full accent-bordeaux-800 cursor-pointer"
            />
          </div>

          {/* Floating Animation Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-plum-800">Animation Float Period</span>
              <span className="text-bordeaux-800 font-bold">{currentItem.floatSpeed.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.2"
              value={currentItem.floatSpeed}
              onChange={(e) => handleUpdateCurrent({ floatSpeed: Number(e.target.value) })}
              className="w-full accent-bordeaux-800 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-plum-500">
              Cycle duration in seconds (lower is faster, higher is slower)
            </span>
          </div>

          {/* Enable Floating Toggle */}
          <div className="flex items-center space-x-3 pt-6">
            <label className="flex items-center space-x-2.5 cursor-pointer font-mono text-xs font-bold text-plum-800">
              <input
                type="checkbox"
                checked={currentItem.enableFloating}
                onChange={(e) => handleUpdateCurrent({ enableFloating: e.target.checked })}
                className="h-4 w-4 rounded border-plum-900 text-bordeaux-800 focus:ring-bordeaux-800"
              />
              <span>Enable Floating Idle Movement</span>
            </label>
          </div>
        </div>

        {/* Live Mini Map Position Preview */}
        <div className="mt-6 p-4 bg-ivory-200/60 rounded-2xl border-2 border-dashed border-plum-900/20 space-y-2">
          <span className="font-mono text-[10px] text-plum-500 uppercase tracking-widest block font-bold">
            HOMEPAGE SPATIAL COORDINATES RADAR
          </span>
          <div className="relative w-full h-44 bg-ivory-100 rounded-xl border border-plum-900/30 overflow-hidden flex items-center justify-center">
            {/* Mock Profile Card Center */}
            <div className="w-1/2 h-2/3 bg-ivory-50 border-2 border-plum-900 rounded-lg shadow-sm flex items-center justify-center text-[11px] font-serif font-bold text-bordeaux-800 text-center p-2">
              Central Profile Card
            </div>

            {/* Selected Object Pin */}
            {currentItem.visible && (
              <div
                className="absolute w-6 h-6 rounded-full bg-bordeaux-800 border-2 border-butter-300 shadow-md flex items-center justify-center text-[9px] font-mono font-bold text-ivory-100 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150"
                style={{
                  left: `${Math.max(5, Math.min(95, currentItem.xPercent))}%`,
                  top: `${Math.max(5, Math.min(95, currentItem.yPercent))}%`,
                }}
              >
                ●
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
