import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

interface BrandLogoProps {
  size?: number; // size in px, defaults to 28
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 28, 
  className = '',
  showText = false
}) => {
  const { branding } = usePortfolio();

  const logoType = branding.logoType || 'monogram';
  const monogramText = branding.monogramText || 'SB';

  if (logoType === 'customImage' && branding.logoImageUrl) {
    return (
      <div 
        className={`relative rounded-full overflow-hidden border border-plum-900 shadow-sm flex-shrink-0 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <img 
          src={branding.logoImageUrl} 
          alt={branding.websiteTitle || 'Logo'} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {/* Custom Designed SB Monogram SVG Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 shadow-sm rounded-full overflow-hidden"
      >
        {/* Outer Circular Badge */}
        <circle cx="50" cy="50" r="48" fill="#5C1327" stroke="#2A102A" strokeWidth="4" />
        
        {/* Inner Subtle Fine Gold Ring Accent */}
        <circle cx="50" cy="50" r="43" stroke="#F9E498" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

        {/* Monogram Graphics */}
        {logoType === 'monogram' && monogramText === 'SB' ? (
          <g>
            {/* Elegant Interlocking S and B */}
            {/* The 'S' stroke in Butter Yellow */}
            <path
              d="M44 26 C38 26 31 30 31 38 C31 46 45 48 45 56 C45 64 36 67 29 64 C25 62 23 58 22 55"
              stroke="#F9E498"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* The 'B' upright stem in Warm Ivory */}
            <line
              x1="48"
              y1="25"
              x2="48"
              y2="75"
              stroke="#FAF7EE"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* The 'B' upper bowl */}
            <path
              d="M48 27 H64 C72 27 76 33 76 39 C76 46 70 50 48 50"
              stroke="#FAF7EE"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* The 'B' lower bowl with elegant flourish */}
            <path
              d="M48 50 H67 C76 50 80 57 80 63 C80 72 73 74 48 74"
              stroke="#FAF7EE"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Subtle Diamond Serifs */}
            <circle cx="22" cy="55" r="2" fill="#F9E498" />
            <circle cx="44" cy="26" r="2" fill="#F9E498" />
          </g>
        ) : (
          /* Custom text initials fallback */
          <text
            x="50"
            y="62"
            fill="#F9E498"
            fontSize={monogramText.length > 2 ? 30 : 42}
            fontFamily="'Fraunces', serif"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="-0.04em"
          >
            {monogramText}
          </text>
        )}
      </svg>

      {showText && (
        <span className="font-serif font-bold text-bordeaux-800 text-sm tracking-tight">
          {branding.websiteTitle}
        </span>
      )}
    </div>
  );
};
