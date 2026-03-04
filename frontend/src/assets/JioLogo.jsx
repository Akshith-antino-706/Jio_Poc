export default function JioLogo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="jioGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#1a5fd4" />
          <stop offset="100%" stopColor="#002fa7" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#jioGrad)" />
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="bold"
        fontSize="38"
        fill="white"
        letterSpacing="-1"
      >
        Jio
      </text>
    </svg>
  );
}
