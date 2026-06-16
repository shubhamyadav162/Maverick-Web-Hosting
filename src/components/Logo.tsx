import { SVGProps, CSSProperties } from 'react';

interface LogoProps {
  type?: 'icon' | 'full' | 'horizontal';
  variant?: 'light' | 'dark' | 'color';
  className?: string;
  style?: CSSProperties;
}

export default function Logo({ type = 'full', variant = 'color', ...props }: LogoProps) {
  // Brand gradient and colors
  // From Deep Blue #0B4A94 through Ocean Blue #0A73B1 to Vivid Teal #029EA5
  const gradientId = "maverick-gradient";
  
  // Decide colors based on background
  const textColPrimary = variant === 'light' ? 'text-gray-900' : 'text-white';
  const textColSecondary = variant === 'light' ? 'text-gray-500' : 'text-indigo-400';

  const renderIcon = () => (
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className || "h-9 w-auto"}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="30" y1="100" x2="150" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B4A94" />
          <stop offset="50%" stopColor="#0A73B1" />
          <stop offset="100%" stopColor="#00A896" />
        </linearGradient>
      </defs>

      {/* Main Stylized "M" Structure */}
      {/* Left thick leg */}
      <path
        d="M 45 92 L 80 32"
        stroke={`url(#${gradientId})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left inner dip */}
      <path
        d="M 80 32 L 102 68"
        stroke={`url(#${gradientId})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right inner ascent */}
      <path
        d="M 102 68 L 126 38"
        stroke={`url(#${gradientId})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right massive rising arrow leg going up-right */}
      <path
        d="M 102 68 L 150 20"
        stroke={`url(#${gradientId})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow Tip at 150, 20 */}
      <path
        d="M 125 18 L 153 17 L 152 45"
        stroke={`url(#${gradientId})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left parallel bottom design leg */}
      <path
        d="M 30 92 L 48 61"
        stroke={`url(#${gradientId})`}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Right parallel bottom design leg */}
      <path
        d="M 132 92 L 115 63"
        stroke={`url(#${gradientId})`}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Code Brackets nested underneath the M dips */}
      {/* Left bracket `<` */}
      <path
        d="M 68 88 L 60 94 L 68 100"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right bracket `>` */}
      <path
        d="M 104 88 L 112 94 L 104 100"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (type === 'icon') {
    return renderIcon();
  }

  if (type === 'horizontal') {
    return (
      <div className={`flex items-center gap-3.5 select-none ${props.className || ''}`}>
        <div className="shrink-0">
          {renderIcon()}
        </div>
        <div className="flex flex-col text-left leading-none">
          <span className={`font-display text-lg font-extrabold tracking-wider ${textColPrimary} uppercase font-sans`}>
            MAVERICK
          </span>
          <span className={`text-[8px] font-mono font-bold tracking-[0.2em] uppercase mt-0.5 ${textColSecondary}`}>
            WEB DEVELOPMENT
          </span>
        </div>
      </div>
    );
  }

  // default type='full' (block list layout, elegant, centered or left)
  return (
    <div className={`flex flex-col items-center justify-center select-none text-center ${props.className || ''}`}>
      <div className="h-16 w-auto flex items-center justify-center mb-2.5">
        {renderIcon()}
      </div>
      <div className="flex flex-col items-center leading-none">
        <span className={`font-display text-2xl font-extrabold tracking-[0.08em] ${textColPrimary} uppercase font-sans`}>
          MAVERICK
        </span>
        <span className={`text-[10px] font-mono font-bold tracking-[0.25em] uppercase mt-1.5 ${textColSecondary}`}>
          WEB DEVELOPMENT
        </span>
      </div>
    </div>
  );
}
