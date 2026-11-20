import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { PlacedSticker, StickerPageId } from '../../types/sticker';

const STORAGE_KEY = 'siri_portfolio_stickers_v1';

interface StickerLayerProps {
  pageId: StickerPageId;
  mouseX?: number;
  mouseY?: number;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({ pageId, mouseX = 0, mouseY = 0 }) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.layouts && Array.isArray(parsed.layouts[pageId])) {
            setStickers(parsed.layouts[pageId].filter((s: PlacedSticker) => s.visible));
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    };

    load();
    // Listen for storage events across tabs or local dispatch
    const handleStorage = () => load();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('stickersUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('stickersUpdated', handleStorage);
    };
  }, [pageId]);

  if (stickers.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
      {stickers.map((s) => {
        const floatAnim =
          s.animation === 'float'
            ? {
                y: [0, -10 * s.scale, 0],
                rotate: [s.rotation - 2, s.rotation + 2, s.rotation - 2],
              }
            : s.animation === 'parallax'
            ? {
                x: mouseX * (s.parallaxFactor || 10),
                y: mouseY * (s.parallaxFactor || 10),
              }
            : {};

        return (
          <motion.div
            key={s.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${s.xPercent}%`,
              top: `${s.yPercent}%`,
              width: s.baseWidth * s.scale,
              height: s.baseHeight * s.scale,
              transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
              zIndex: s.zIndex,
              opacity: s.opacity,
            }}
            animate={floatAnim}
            transition={
              s.animation === 'float'
                ? {
                    duration: s.floatSpeed || 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : { type: 'spring', damping: 25, stiffness: 120 }
            }
          >
            <img
              src={s.url}
              alt=""
              className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none"
              draggable={false}
              loading="lazy"
            />
          </motion.div>
        );
      })}
    </div>
  );
};
