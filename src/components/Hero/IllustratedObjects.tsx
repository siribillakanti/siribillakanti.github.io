import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { DecorationItemConfig } from '../../types/portfolio';

interface IllustratedObjectsProps {
  onSelectProject?: (projectId: string) => void;
  mouseX: number;
  mouseY: number;
}

export const IllustratedObjects: React.FC<IllustratedObjectsProps> = ({
  onSelectProject,
  mouseX,
  mouseY,
}) => {
  const { detailedDecorations } = usePortfolio();
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const dec = detailedDecorations || {};

  // Parallax calculations based on cursor position (-1 to 1)
  const calcParallax = (factor: number) => ({
    x: mouseX * factor,
    y: mouseY * factor,
  });

  const getBaseType = (key: string, item?: DecorationItemConfig): string => {
    if (item?.type) return item.type;
    const known = [
      'callaLily',
      'tigerLily1',
      'tigerLily2',
      'orchid',
      'pacman',
      'vintageCamera',
      'instantCamera',
      'microchip',
      'wordle'
    ];
    const match = known.find(k => key === k || key.startsWith(`${k}_`));
    return match || key;
  };

  const renderIllustration = (key: string, item: DecorationItemConfig) => {
    const baseType = getBaseType(key, item);

    switch (baseType) {
      case 'wordle': {
        const letters = item.wordleLetters || ['S', 'I', 'R', 'I'];
        const colors = item.wordleColors || ['#538D4E', '#B59F3B', '#538D4E', '#538D4E'];
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(-16)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onClick={() => onSelectProject && onSelectProject('wordlerush')}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { y: [0, -6 * item.scale, 0] }
                  : { y: 0 }
              }
              transition={{
                duration: item.floatSpeed || 4.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative group"
            >
              <div className="relative p-1.5 sm:p-2 bg-plum-950/90 backdrop-blur-sm border-2 border-plum-900/40 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {letters.map((letter, idx) => {
                    const bgColor = colors[idx % colors.length] || '#538D4E';
                    return (
                      <div
                        key={idx}
                        className="relative w-8 h-9 sm:w-10 sm:h-11 rounded-lg flex items-center justify-center text-white font-sans font-extrabold text-base sm:text-lg select-none transition-transform duration-200 group-hover:-translate-y-0.5"
                        style={{
                          backgroundColor: bgColor,
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-semibold rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                WordleRush (Competitive Game)
              </div>
            </motion.div>
          </motion.div>
        );
      }

      case 'callaLily':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(14)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { rotate: [-2, 3, -2], y: [0, -5 * item.scale, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: item.floatSpeed || 6.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'bottom center',
              }}
              className="relative group"
            >
              <div className="filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg width="56" height="72" viewBox="0 0 100 120" fill="none">
                  <path d="M48 115 C 47 75, 52 50, 50 32" stroke="#7FA375" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M48 85 C 38 80, 28 85, 22 92 C 30 95, 42 90, 48 85 Z" fill="#94B78A" stroke="#5C1327" strokeWidth="1.5" />
                  <path d="M50 32 C 26 20, 16 58, 48 84 C 78 58, 70 20, 50 32 Z" fill="#FCFBF7" stroke="#5C1327" strokeWidth="2.5" />
                  <path d="M46 52 C 40 64, 46 76, 50 80 C 54 76, 60 64, 54 52 Z" fill="#5C1327" />
                  <path d="M48 58 C 45 66, 48 74, 50 77 C 52 74, 55 66, 52 58 Z" fill="#3D153E" />
                  <path d="M50 26 L 49 58" stroke="#F9E498" strokeWidth="4" strokeLinecap="round" />
                  <path d="M49 22 C 54 18, 58 20, 52 28" stroke="#FCFBF7" strokeWidth="2.5" fill="none" />
                </svg>
              </div>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Burgundy Calla Lily
              </div>
            </motion.div>
          </motion.div>
        );

      case 'tigerLily1':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(20)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { rotate: [3, -3, 3], y: [0, 6 * item.scale, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: item.floatSpeed || 6.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'top center',
              }}
              className="relative group"
            >
              <div className="filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg width="72" height="82" viewBox="0 0 100 115" fill="none">
                  <path d="M50 112 C 48 85, 56 60, 50 35" stroke="#7FA375" strokeWidth="4" strokeLinecap="round" />
                  <path d="M49 70 C 35 65, 25 72, 20 80 C 30 82, 42 76, 49 70 Z" fill="#94B78A" stroke="#5C1327" strokeWidth="1.5" />
                  <path d="M50 40 Q 32 60 28 78" stroke="#841C34" strokeWidth="1.8" fill="none" />
                  <ellipse cx="28" cy="80" rx="3.5" ry="1.8" fill="#3D0B18" transform="rotate(-25 28 80)" />
                  <path d="M50 40 Q 42 66 42 84" stroke="#841C34" strokeWidth="1.8" fill="none" />
                  <ellipse cx="42" cy="86" rx="3.5" ry="1.8" fill="#3D0B18" />
                  <path d="M50 40 Q 58 66 58 84" stroke="#841C34" strokeWidth="1.8" fill="none" />
                  <ellipse cx="58" cy="86" rx="3.5" ry="1.8" fill="#3D0B18" />
                  <path d="M50 40 Q 68 60 72 78" stroke="#841C34" strokeWidth="1.8" fill="none" />
                  <ellipse cx="72" cy="80" rx="3.5" ry="1.8" fill="#3D0B18" transform="rotate(25 72 80)" />
                  <path d="M50 38 C 30 20, 22 5, 34 0 C 42 0, 48 20, 50 38 Z" fill="#F06529" stroke="#5C1327" strokeWidth="2" />
                  <path d="M50 38 C 70 20, 78 5, 66 0 C 58 0, 52 20, 50 38 Z" fill="#F06529" stroke="#5C1327" strokeWidth="2" />
                  <path d="M50 38 C 25 35, 8 20, 14 12 C 22 8, 38 25, 50 38 Z" fill="#FF7F3F" stroke="#5C1327" strokeWidth="2" />
                  <path d="M50 38 C 75 35, 92 20, 86 12 C 78 8, 62 25, 50 38 Z" fill="#FF7F3F" stroke="#5C1327" strokeWidth="2" />
                  <path d="M50 38 C 40 18, 44 2, 50 4 C 56 2, 60 18, 50 38 Z" fill="#F9A03F" stroke="#5C1327" strokeWidth="2" />
                  <circle cx="48" cy="28" r="1.3" fill="#3D0B18" />
                  <circle cx="52" cy="26" r="1.3" fill="#3D0B18" />
                  <circle cx="45" cy="22" r="1.3" fill="#3D0B18" />
                  <circle cx="55" cy="21" r="1.3" fill="#3D0B18" />
                  <circle cx="38" cy="26" r="1.2" fill="#3D0B18" />
                  <circle cx="62" cy="26" r="1.2" fill="#3D0B18" />
                  <circle cx="32" cy="20" r="1.1" fill="#3D0B18" />
                  <circle cx="68" cy="20" r="1.1" fill="#3D0B18" />
                  <path d="M50 38 L 50 82" stroke="#4A703E" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="50" cy="83" r="2.2" fill="#3D0B18" />
                </svg>
              </div>

              <div
                className={`absolute top-full right-0 mt-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Tiger Lily (Lilium lancifolium)
              </div>
            </motion.div>
          </motion.div>
        );

      case 'tigerLily2':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(-19)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { rotate: [-4, 3, -4], y: [0, -5 * item.scale, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: item.floatSpeed || 5.7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'bottom center',
              }}
              className="relative group"
            >
              <div className="filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg width="58" height="68" viewBox="0 0 100 110" fill="none">
                  <path d="M50 105 C 55 80, 48 55, 50 35" stroke="#7FA375" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M50 40 Q 34 58 30 74" stroke="#841C34" strokeWidth="1.6" fill="none" />
                  <ellipse cx="30" cy="76" rx="3" ry="1.6" fill="#3D0B18" transform="rotate(-20 30 76)" />
                  <path d="M50 40 Q 64 58 68 74" stroke="#841C34" strokeWidth="1.6" fill="none" />
                  <ellipse cx="68" cy="76" rx="3" ry="1.6" fill="#3D0B18" transform="rotate(20 68 76)" />
                  <path d="M50 35 C 32 18, 25 5, 36 2 C 44 2, 48 20, 50 35 Z" fill="#F06529" stroke="#5C1327" strokeWidth="1.8" />
                  <path d="M50 35 C 68 18, 75 5, 64 2 C 56 2, 52 20, 50 35 Z" fill="#F06529" stroke="#5C1327" strokeWidth="1.8" />
                  <path d="M50 35 C 28 32, 12 18, 18 12 C 25 8, 40 24, 50 35 Z" fill="#FF7F3F" stroke="#5C1327" strokeWidth="1.8" />
                  <path d="M50 35 C 72 32, 88 18, 82 12 C 75 8, 60 24, 50 35 Z" fill="#FF7F3F" stroke="#5C1327" strokeWidth="1.8" />
                  <circle cx="48" cy="25" r="1.1" fill="#3D0B18" />
                  <circle cx="52" cy="23" r="1.1" fill="#3D0B18" />
                  <circle cx="42" cy="21" r="1.1" fill="#3D0B18" />
                  <circle cx="58" cy="21" r="1.1" fill="#3D0B18" />
                </svg>
              </div>

              <div
                className={`absolute top-full left-0 mt-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Tiger Lily Companion
              </div>
            </motion.div>
          </motion.div>
        );

      case 'orchid':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(-18)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { rotate: [2, -4, 2], y: [0, 5 * item.scale, 0] }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: item.floatSpeed || 5.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative group"
            >
              <div className="filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg width="54" height="54" viewBox="0 0 100 100" fill="none">
                  <ellipse cx="50" cy="24" rx="14" ry="20" fill="#C72C61" stroke="#3D153E" strokeWidth="2.5" />
                  <ellipse cx="26" cy="44" rx="20" ry="14" transform="rotate(-15 26 44)" fill="#D94B7C" stroke="#3D153E" strokeWidth="2.5" />
                  <ellipse cx="74" cy="44" rx="20" ry="14" transform="rotate(15 74 44)" fill="#D94B7C" stroke="#3D153E" strokeWidth="2.5" />
                  <ellipse cx="34" cy="70" rx="16" ry="12" fill="#9F1D64" stroke="#3D153E" strokeWidth="2" />
                  <ellipse cx="66" cy="70" rx="16" ry="12" fill="#9F1D64" stroke="#3D153E" strokeWidth="2" />
                  <path d="M42 46 C 36 62, 42 78, 50 82 C 58 78, 64 62, 58 46 Z" fill="#841C34" stroke="#FAF7EE" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="4.5" fill="#F9E498" stroke="#5C1327" strokeWidth="1" />
                </svg>
              </div>

              <div
                className={`absolute top-full left-0 mt-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Magenta Orchid
              </div>
            </motion.div>
          </motion.div>
        );

      case 'pacman':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(22)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onClick={() => onSelectProject && onSelectProject('gesturepac')}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { y: [0, 6 * item.scale, 0], rotate: [4, -3, 4] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                duration: item.floatSpeed || 5.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative group"
            >
              <div className="relative p-2 bg-butter-400 border-2 border-plum-900 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                  <path d="M50 50 L95 24 A 45 45 0 1 0 95 76 Z" fill="#F5DB78" stroke="#2A102A" strokeWidth="6" />
                  <circle cx="50" cy="25" r="5.5" fill="#2A102A" />
                  <circle cx="86" cy="50" r="4" fill="#C72C61" />
                  <circle cx="98" cy="50" r="3" fill="#C72C61" opacity="0.6" />
                </svg>
              </div>

              <div
                className={`absolute top-full right-0 mt-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                GesturePac (Vision Game)
              </div>
            </motion.div>
          </motion.div>
        );

      case 'vintageCamera':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(-15)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onClick={() => onSelectProject && onSelectProject('gesturestudio')}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { y: [0, -6 * item.scale, 0], rotate: [-4, 3, -4] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                duration: item.floatSpeed || 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative group"
            >
              <div className="p-2 bg-ivory-100 border-2 border-plum-900 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105">
                <svg width="50" height="36" viewBox="0 0 110 75" fill="none">
                  <rect x="5" y="18" width="100" height="52" rx="7" fill="#3D153E" stroke="#2A102A" strokeWidth="2.5" />
                  <rect x="5" y="18" width="100" height="15" rx="3" fill="#E8E2D2" stroke="#2A102A" strokeWidth="2" />
                  <rect x="7" y="34" width="96" height="34" rx="3" fill="#240B24" />
                  <rect x="16" y="11" width="16" height="7" rx="1.5" fill="#C2B8A3" stroke="#2A102A" strokeWidth="1.5" />
                  <rect x="80" y="12" width="12" height="6" rx="1.5" fill="#C2B8A3" stroke="#2A102A" strokeWidth="1.5" />
                  <rect x="70" y="8" width="7" height="10" rx="1" fill="#C72C61" stroke="#2A102A" strokeWidth="1.5" />
                  <rect x="82" y="22" width="14" height="8" rx="1.5" fill="#1D4ED8" stroke="#2A102A" strokeWidth="1.5" />
                  <circle cx="28" cy="25" r="3" fill="#C72C61" />
                  <circle cx="55" cy="46" r="21" fill="#E8E2D2" stroke="#2A102A" strokeWidth="2.5" />
                  <circle cx="55" cy="46" r="16" fill="#1F0B20" stroke="#F9E498" strokeWidth="1.8" />
                  <circle cx="55" cy="46" r="10" fill="#1D4ED8" opacity="0.8" />
                  <circle cx="53" cy="44" r="3" fill="#FAF7EE" opacity="0.7" />
                </svg>
              </div>

              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                GestureStudio (Vision Camera)
              </div>
            </motion.div>
          </motion.div>
        );

      case 'instantCamera':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(16)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { y: [0, -5 * item.scale, 0], rotate: [4, -2, 4] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                duration: item.floatSpeed || 5.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative group"
            >
              <div className="p-2 bg-butter-300 border-2 border-plum-900 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105">
                <svg width="46" height="42" viewBox="0 0 90 82" fill="none">
                  <rect x="5" y="8" width="80" height="68" rx="8" fill="#FAF7EE" stroke="#2A102A" strokeWidth="2.5" />
                  <path d="M5 28 L85 28 L85 44 L5 44 Z" fill="#C72C61" />
                  <rect x="62" y="14" width="16" height="10" rx="2" fill="#F9E498" stroke="#2A102A" strokeWidth="1.5" />
                  <circle cx="16" cy="18" r="4.5" fill="#5C1327" stroke="#2A102A" strokeWidth="1.5" />
                  <circle cx="45" cy="50" r="20" fill="#2A102A" stroke="#FAF7EE" strokeWidth="2" />
                  <circle cx="45" cy="50" r="14" fill="#1D4ED8" stroke="#C72C61" strokeWidth="1.5" />
                  <circle cx="45" cy="50" r="7" fill="#FAF7EE" opacity="0.3" />
                  <circle cx="42" cy="47" r="2.5" fill="#FAF7EE" />
                  <rect x="28" y="15" width="8" height="7" rx="1.5" fill="#2A102A" />
                </svg>
              </div>

              <div
                className={`absolute bottom-full right-1/2 translate-x-1/2 mb-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Analog 35mm
              </div>
            </motion.div>
          </motion.div>
        );

      case 'microchip':
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
            }}
            animate={calcParallax(15)}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onMouseEnter={() => setHoveredObject(key)}
            onMouseLeave={() => setHoveredObject(null)}
          >
            <motion.div
              animate={
                item.enableFloating
                  ? { y: [0, -4 * item.scale, 0], rotate: [5, -3, 5] }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                duration: item.floatSpeed || 4.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              className="relative group"
            >
              <div className="p-1.5 bg-plum-900 border-2 border-butter-400 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105">
                <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
                  <rect x="15" y="15" width="50" height="50" rx="5" fill="#3D153E" stroke="#FAF7EE" strokeWidth="2" />
                  <line x1="25" y1="5" x2="25" y2="15" stroke="#F9E498" strokeWidth="2" />
                  <line x1="40" y1="5" x2="40" y2="15" stroke="#F9E498" strokeWidth="2" />
                  <line x1="55" y1="5" x2="55" y2="15" stroke="#F9E498" strokeWidth="2" />
                  <line x1="25" y1="65" x2="25" y2="75" stroke="#F9E498" strokeWidth="2" />
                  <line x1="40" y1="65" x2="40" y2="75" stroke="#F9E498" strokeWidth="2" />
                  <line x1="55" y1="65" x2="55" y2="75" stroke="#F9E498" strokeWidth="2" />
                  <line x1="5" y1="25" x2="15" y2="25" stroke="#F9E498" strokeWidth="2" />
                  <line x1="5" y1="40" x2="15" y2="40" stroke="#F9E498" strokeWidth="2" />
                  <line x1="5" y1="55" x2="15" y2="55" stroke="#F9E498" strokeWidth="2" />
                  <line x1="65" y1="25" x2="75" y2="25" stroke="#F9E498" strokeWidth="2" />
                  <line x1="65" y1="40" x2="75" y2="40" stroke="#F9E498" strokeWidth="2" />
                  <line x1="65" y1="55" x2="75" y2="55" stroke="#F9E498" strokeWidth="2" />
                  <rect x="27" y="27" width="26" height="26" rx="3" fill="#1F0B20" stroke="#A8C69F" strokeWidth="1.5" />
                  <text x="40" y="44" fill="#FAF7EE" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    CS
                  </text>
                </svg>
              </div>

              <div
                className={`absolute bottom-full right-0 mb-1.5 px-3 py-1 bg-plum-950/95 text-butter-300 text-xs font-mono font-medium rounded-full border border-butter-300/30 shadow-xl backdrop-blur-md whitespace-nowrap transition-opacity duration-200 z-30 ${
                  hoveredObject === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Systems & Architecture
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      {Object.entries(dec).map(([key, config]) => {
        if (!config || !config.visible) return null;
        return renderIllustration(key, config);
      })}
    </div>
  );
};
