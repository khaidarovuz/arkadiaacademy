import React from 'react';

interface ArkadiaLogoProps {
  variant?: 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
  className?: string;
  lightMode?: boolean;
}

export const ArkadiaLogo: React.FC<ArkadiaLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  customLogoUrl,
  className = '',
  lightMode = false,
}) => {
  const sizeMap = {
    sm: { shield: 32, text: 'text-sm', sub: 'text-[9px]' },
    md: { shield: 44, text: 'text-lg', sub: 'text-xs' },
    lg: { shield: 64, text: 'text-2xl', sub: 'text-sm' },
    xl: { shield: 96, text: 'text-4xl', sub: 'text-base' },
  };

  const { shield: shieldSize, text: textClass, sub: subClass } = sizeMap[size];

  // If user uploaded a custom logo
  if (customLogoUrl) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={customLogoUrl}
          alt="ARKADIA ACADEMY"
          className="object-contain rounded-lg"
          style={{ height: shieldSize, width: 'auto', maxHeight: shieldSize }}
        />
        {variant !== 'icon' && (
          <div className="flex flex-col leading-tight">
            <span className={`font-extrabold tracking-wider ${lightMode ? 'text-white' : 'text-neutral-900 dark:text-white'} ${textClass} transition-colors`}>
              ARKADIA
            </span>
            <span className={`font-medium tracking-widest lowercase ${lightMode ? 'text-red-300' : 'text-red-600 dark:text-red-400'} ${subClass} transition-colors`}>
              academy
            </span>
          </div>
        )}
      </div>
    );
  }

  // Vector rendition of the Arkadia Academy shield emblem matching image.png
  const ShieldSVG = (
    <svg
      width={shieldSize}
      height={(shieldSize * 70) / 58}
      viewBox="0 0 58 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
    >
      {/* Outer Crimson Shield */}
      <path
        d="M29 68C29 68 53 58 53 23V6H5V23C5 58 29 68 29 68Z"
        fill="#991B1B"
      />
      {/* Shield Inner Border Highlight */}
      <path
        d="M29 64.5C29 64.5 49.5 55 49.5 24V9.5H8.5V24C8.5 55 29 64.5 29 64.5Z"
        stroke="#DC2626"
        strokeWidth="1.5"
      />

      {/* Top White Book Compartment */}
      <rect x="11.5" y="12" width="35" height="18" rx="1.5" fill="#FFFFFF" />
      
      {/* Book Center Spine */}
      <line x1="29" y1="12" x2="29" y2="30" stroke="#991B1B" strokeWidth="1.2" />

      {/* Left Book Page with Crimson Inscription */}
      <rect x="15" y="15" width="10.5" height="12" rx="1" fill="#991B1B" />
      <path d="M17.5 21L19.5 17L21.5 21M18.5 20H20.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M22.5 17V24M22.5 24H24" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />

      {/* Right Book Page with Crimson Inscription */}
      <rect x="32.5" y="15" width="10.5" height="12" rx="1" fill="#991B1B" />
      <path d="M35 18H38.5C39.5 18 39.5 20.5 38 21C39.5 21.5 39.5 24 38.5 24H35" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />

      {/* Lower White Field */}
      <path
        d="M29 60C29 60 46 51 46 34H12C12 51 29 60 29 60Z"
        fill="#FFFFFF"
      />

      {/* Three Crimson Circles/Dots (heraldic arrangement: 2 top, 1 bottom) */}
      <circle cx="21" cy="42" r="3.6" fill="#991B1B" />
      <circle cx="37" cy="42" r="3.6" fill="#991B1B" />
      <circle cx="29" cy="51" r="3.6" fill="#991B1B" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {ShieldSVG}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 group ${className}`}>
        {ShieldSVG}
        <div className="flex flex-col items-center">
          <span className={`font-black tracking-[0.18em] ${lightMode ? 'text-white' : 'text-neutral-900 dark:text-white'} ${textClass} font-heading transition-colors`}>
            ARKADIA
          </span>
          <span className={`font-semibold tracking-[0.25em] lowercase ${lightMode ? 'text-red-300' : 'text-red-600 dark:text-red-400'} ${subClass} transition-colors`}>
            academy
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (default for Navbar)
  return (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {ShieldSVG}
      <div className="flex flex-col -space-y-0.5">
        <span className={`font-black tracking-[0.12em] ${lightMode ? 'text-white' : 'text-neutral-900 dark:text-white'} ${textClass} font-heading leading-tight transition-colors`}>
          ARKADIA
        </span>
        <span className={`font-semibold tracking-[0.2em] lowercase ${lightMode ? 'text-red-300' : 'text-red-600 dark:text-red-400'} ${subClass} leading-tight transition-colors`}>
          academy
        </span>
      </div>
    </div>
  );
};
