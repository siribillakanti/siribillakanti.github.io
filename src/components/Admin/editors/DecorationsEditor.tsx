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
  RefreshCw,
  Copy,
  Plus,
  Trash2
} from 'lucide-react';
import { ScrapbookStickerStudio } from './ScrapbookStickerStudio';

interface BaseDecorationMeta {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BASE_DECORATIONS: BaseDecorationMeta[] = [
  { id: 'callaLily', label: 'Burgundy Calla Lily', icon: Flower2 },
  { id: 'tigerLily1', label: 'Tiger Lily Bloom', icon: Flower2 },
  { id: 'tigerLily2', label: 'Tiger Lily Bud', icon: Flower2 },
  { id: 'orchid', label: 'Magenta Orchid', icon: Flower2 },
  { id: 'pacman', label: 'Pac-Man Arcade', icon: Sparkles },
  { id: 'vintageCamera', label: 'Vintage 35mm Camera', icon: Camera },
  { id: 'instantCamera', label: 'Retro Instant Camera', icon: Camera },
  { id: 'microchip', label: 'Silicon Microchip', icon: Cpu },
  { id: 'wordle', label: 'Wordle Tiles', icon: Sparkles },
];

export const DecorationsEditor: React.FC = () => {
  const { detailedDecorations, updateDetailedDecorations, showToast } = usePortfolio();
  const [selectedKey, setSelectedKey] = useState<string>('callaLily');
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Resolve base type for any key in detailedDecorations
  const getBaseType = (key: string, item?: DecorationItemConfig): string => {
    if (item?.type) return item.type;
    const match = BASE_DECORATIONS.find(b => key === b.id || key.startsWith(`${b.id}_`));
    return match ? match.id : key;
  };

  // Group and label all active items in detailedDecorations
  const activeEntries = Object.entries(detailedDecorations || {});

  const objectsList = activeEntries.map(([key, config]) => {
    const baseType = getBaseType(key, config);
    const baseDef = BASE_DECORATIONS.find(b => b.id === baseType) || {
      id: baseType,
      label: key,
      icon: Flower2
    };

    const sameTypeKeys = activeEntries
      .filter(([k, c]) => getBaseType(k, c) === baseType)
      .map(([k]) => k);

    let label = baseDef.label;
    if (sameTypeKeys.length > 1) {
      const idx = sameTypeKeys.indexOf(key);
      label = idx === 0 ? baseDef.label : `${baseDef.label} (Copy ${idx + 1})`;
    }

    const isBaseKey = BASE_DECORATIONS.some(b => b.id === key);

    return {
      key,
      baseType,
      label,
      icon: baseDef.icon,
      isBaseKey,
      config,
    };
  });

  // Ensure selected key is valid
  const currentEntry = objectsList.find(o => o.key === selectedKey) || objectsList[0];
  const currentKey = currentEntry ? currentEntry.key : 'callaLily';
  const currentItem: DecorationItemConfig = detailedDecorations[currentKey] || {
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
      [currentKey]: {
        ...currentItem,
        ...updates,
      },
    });
  };

  // Duplicate the currently selected element
  const handleDuplicateCurrent = () => {
    const baseType = getBaseType(currentKey, currentItem);
    const baseDef = BASE_DECORATIONS.find(b => b.id === baseType) || BASE_DECORATIONS[0];
    const newKey = `${baseType}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newConfig: DecorationItemConfig = {
      ...currentItem,
      type: baseType,
      visible: true,
      xPercent: Math.max(-15, Math.min(105, currentItem.xPercent + 6)),
      yPercent: Math.max(-25, Math.min(105, currentItem.yPercent + 6)),
      rotation: Math.floor(Math.random() * 20 - 10),
    };
    updateDetailedDecorations({
      ...detailedDecorations,
      [newKey]: newConfig,
    });
    setSelectedKey(newKey);
    showToast('Element Duplicated', `Added another ${baseDef.label} to Botanical Garden.`, 'success');
  };

  // Add a new instance of any base decoration
  const handleAddNewElement = (baseId: string) => {
    const baseDef = BASE_DECORATIONS.find(b => b.id === baseId) || BASE_DECORATIONS[0];
    const baseConfig = detailedDecorations[baseId] || {
      visible: true,
      xPercent: 20 + Math.random() * 30,
      yPercent: 20 + Math.random() * 30,
      scale: 1.0,
      rotation: 0,
      floatSpeed: 5.0,
      enableFloating: true,
    };
    const newKey = `${baseId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newConfig: DecorationItemConfig = {
      ...baseConfig,
      type: baseId,
      visible: true,
      xPercent: Math.max(-15, Math.min(105, baseConfig.xPercent + (Math.random() * 12 - 6))),
      yPercent: Math.max(-25, Math.min(105, baseConfig.yPercent + (Math.random() * 12 - 6))),
      rotation: Math.floor(Math.random() * 16 - 8),
    };
    updateDetailedDecorations({
      ...detailedDecorations,
      [newKey]: newConfig,
    });
    setSelectedKey(newKey);
    setShowAddMenu(false);
    showToast('Element Added', `Added ${baseDef.label} to Botanical Garden.`, 'success');
  };

  // Delete current instance (or hide if base)
  const handleDeleteCurrent = () => {
    if (currentEntry?.isBaseKey) {
      handleUpdateCurrent({ visible: false });
      showToast('Element Hidden', `${currentEntry.label} is now hidden.`, 'info');
      return;
    }
    const next = { ...detailedDecorations };
    delete next[currentKey];
    updateDetailedDecorations(next);
    const remaining = Object.keys(next);
    setSelectedKey(remaining[0] || 'callaLily');
    showToast('Element Deleted', `${currentEntry?.label || 'Item'} removed.`, 'info');
  };

  // Wordle letters and colors helper
  const isWordle = getBaseType(currentKey, currentItem) === 'wordle';
  const wordleLetters = currentItem.wordleLetters || ['S', 'I', 'R', 'I'];
  const wordleColors = currentItem.wordleColors || ['#538D4E', '#B59F3B', '#538D4E', '#538D4E'];

  const handleWordleLetterChange = (idx: number, letter: string) => {
    const next = [...wordleLetters];
    next[idx] = letter.slice(-1).toUpperCase() || ' ';
    handleUpdateCurrent({ wordleLetters: next });
  };

  const handleWordleColorToggle = (idx: number) => {
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
        <div className="flex items-center justify-between pb-2 border-b-2 border-plum-900/15">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-butter-300 rounded-xl border border-plum-900 shadow-sm text-bordeaux-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-bordeaux-800">
                Illustrations & Botanical Garden Editor
              </h3>
              <p className="font-sans text-xs text-plum-700">
                Arrange, duplicate, and configure floating botanical illustrations and elements around the homepage profile card.
              </p>
            </div>
          </div>

          {/* Add Element Button & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-mono text-xs font-bold rounded-xl border border-plum-900 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-butter-300" />
              <span>Add Element</span>
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-ivory-50 border-2 border-plum-900 rounded-xl shadow-xl z-30 py-2 divide-y divide-plum-900/10">
                <div className="px-3 py-1 text-[10px] font-mono uppercase font-bold text-plum-500">
                  Select Element to Add
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {BASE_DECORATIONS.map((b) => {
                    const Icon = b.icon;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleAddNewElement(b.id)}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 text-left text-xs font-mono text-plum-900 hover:bg-butter-300 transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5 text-bordeaux-800" />
                        <span>{b.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Object Selection Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {objectsList.map((obj) => {
            const Icon = obj.icon;
            const isSelected = currentKey === obj.key;
            const isVisible = obj.config?.visible !== false;
            return (
              <button
                key={obj.key}
                type="button"
                onClick={() => setSelectedKey(obj.key)}
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
              {currentEntry?.label}
            </h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              currentItem.visible ? 'bg-pistachio-300 text-plum-900' : 'bg-red-100 text-red-700'
            }`}>
              {currentItem.visible ? 'VISIBLE' : 'HIDDEN'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Visibility Toggle */}
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
              <span>{currentItem.visible ? 'Hide' : 'Show'}</span>
            </button>

            {/* Duplicate Button */}
            <button
              type="button"
              onClick={handleDuplicateCurrent}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-ivory-100 hover:bg-butter-300 text-plum-900 font-mono text-xs font-bold rounded-lg border border-plum-900/30 transition-all"
              title="Add another copy of this element"
            >
              <Copy className="w-3.5 h-3.5 text-bordeaux-800" />
              <span>Duplicate</span>
            </button>

            {/* Delete Button (for custom added copies) */}
            {!currentEntry?.isBaseKey && (
              <button
                type="button"
                onClick={handleDeleteCurrent}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-mono text-xs font-bold rounded-lg border border-red-300 transition-all"
                title="Delete this instance"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Wordle-Specific Tile Configuration */}
        {isWordle && (
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

            {/* All Visible Pins */}
            {objectsList
              .filter(o => o.config.visible !== false)
              .map(o => {
                const isSelected = o.key === currentKey;
                return (
                  <div
                    key={o.key}
                    className={`absolute rounded-full border shadow-md flex items-center justify-center font-mono font-bold -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 ${
                      isSelected
                        ? 'w-6 h-6 bg-bordeaux-800 border-2 border-butter-300 text-ivory-100 text-[9px] z-10'
                        : 'w-3.5 h-3.5 bg-plum-700/70 border-ivory-100 text-[6px] text-transparent'
                    }`}
                    style={{
                      left: `${Math.max(5, Math.min(95, o.config.xPercent))}%`,
                      top: `${Math.max(5, Math.min(95, o.config.yPercent))}%`,
                    }}
                  >
                    ●
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Embedded Scrapbook Sticker Studio */}
      <ScrapbookStickerStudio />
    </div>
  );
};
