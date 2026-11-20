import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextTarget, setIsTextTarget] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer and no reduced motion preference
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        ringX = mouseX;
        ringY = mouseY;
      }

      // Immediately translate central dot with zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Inspect target element
      const target = e.target as HTMLElement | null;
      if (target) {
        // Detect text inputs / editable fields to restore natural text cursor
        const isTextInput = Boolean(
          target.closest('input, textarea, select, [contenteditable="true"]')
        );
        setIsTextTarget(isTextInput);

        // Detect interactive clickable elements for ring expansion
        const isClickable = Boolean(
          target.closest('a, button, [role="button"], .cursor-pointer, summary')
        );
        setIsHovered(isClickable && !isTextInput);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth animation loop for the outer ring using lerp (0.2)
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animFrameId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animFrameId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  // If hovering over text inputs, let native I-beam cursor do its job
  const hideCustom = !isVisible || isTextTarget;

  return (
    <div 
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none transition-opacity duration-150 ${
        hideCustom ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Central Precision Dot: 0ms zero-lag pointer tracking */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full pointer-events-none transition-colors duration-150 ${
          isHovered ? 'bg-raspberry-600' : 'bg-bordeaux-800'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Outer Fine Reticle Ring: Smooth interpolation follower */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-[width,height,margin,border-color,background-color] duration-200 ease-out ${
          isHovered
            ? 'w-10 h-10 -ml-5 -mt-5 border-raspberry-600/70 bg-butter-300/15'
            : 'w-6 h-6 -ml-3 -mt-3 border-bordeaux-800/40 bg-transparent'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
