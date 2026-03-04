/* Inline SVG logo components for the screensaver */

export function JioLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jioG" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1a5fd4" />
          <stop offset="100%" stopColor="#002fa7" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#jioG)" />
      <text x="50" y="64" textAnchor="middle"
        fontFamily="Georgia, serif" fontStyle="italic"
        fontWeight="bold" fontSize="38" fill="white" letterSpacing="-1">Jio</text>
    </svg>
  );
}

export function OpenAILogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#080808" />
      {/* OpenAI blossom shape */}
      <g transform="translate(50,50)" fill="white">
        <path d="
          M0-28 C4-28 7-25 7-21 L7-7
          C12-10 18-9 21-5 C25-1 25 5 21 9
          L11 19 C16 22 17 28 13 32
          C10 35 5 36 1 34 L-7 30
          C-7 35 -12 39 -17 38
          C-22 37 -25 32 -24 27 L-22 17
          C-27 17 -31 13 -31 8 C-31 3 -27-1 -22-1
          L-10-1 C-12-6 -10-12 -5-14
          C-1-16 4-15 7-11 L12-3
          C13-8 17-12 22-12 C27-12 31-8 31-3
          C31 2 27 6 22 6 L8 6
          C9 11 7 17 2 19 C-2 21 -7 20 -10 16
          L-15 8 C-18 13 -24 15 -28 12
          C-32 9 -33 3 -30-1 L-22-9
          C-27-11 -29-17 -26-21
          C-23-25 -17-26 -13-23 L-6-17
          C-5-22 -1-26 4-27 Z
        " transform="scale(0.55)" opacity="0.95"/>
      </g>
    </svg>
  );
}

export function FirefliesLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ffG" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#9d7cff" />
          <stop offset="100%" stopColor="#5b21b6" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#ffG)" />
      {/* Microphone body */}
      <rect x="38" y="22" width="24" height="36" rx="12" fill="white" opacity="0.95"/>
      {/* Mic stand */}
      <path d="M27 54 C27 70 73 70 73 54" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <line x1="50" y1="70" x2="50" y2="80" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <line x1="38" y1="80" x2="62" y2="80" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      {/* Sound waves */}
      <circle cx="50" cy="40" r="6" fill="#9d7cff" opacity="0.8"/>
    </svg>
  );
}

export function N8nLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="n8nG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea4b71" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#n8nG)" />
      <text x="50" y="62" textAnchor="middle"
        fontFamily="'Inter', Arial, sans-serif"
        fontWeight="800" fontSize="30" fill="white" letterSpacing="-1">n8n</text>
    </svg>
  );
}

export function JioCinemaLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jcG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#jcG)" />
      {/* Clapperboard */}
      <rect x="20" y="34" width="60" height="42" rx="6" fill="#002fa7"/>
      <rect x="20" y="28" width="60" height="12" rx="4" fill="#1a5fd4"/>
      {/* Stripes on top */}
      <rect x="28" y="28" width="8" height="12" fill="#e8eaf2" opacity="0.8"/>
      <rect x="44" y="28" width="8" height="12" fill="#e8eaf2" opacity="0.8"/>
      <rect x="60" y="28" width="8" height="12" fill="#e8eaf2" opacity="0.8"/>
      {/* Play button */}
      <polygon points="42,46 42,66 64,56" fill="white" opacity="0.95"/>
    </svg>
  );
}
