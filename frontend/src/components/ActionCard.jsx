import { useState } from 'react';

export default function ActionCard({ action, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isFeatured = action.isCombined; // Meeting Hub spans 2 cols

  return (
    <div
      onClick={() => onClick(action)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: isFeatured ? 'span 2' : 'span 1',
        background: hovered ? '#181c2a' : '#12151f',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 20,
        padding: isFeatured ? '24px 28px' : '24px 22px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.5)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        display: isFeatured ? 'flex' : 'block',
        alignItems: isFeatured ? 'center' : undefined,
        gap: isFeatured ? 24 : undefined,
      }}
    >
      {/* Gradient overlay on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: action.gradient,
        opacity: hovered ? 0.06 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: isFeatured ? 64 : 52,
        height: isFeatured ? 64 : 52,
        borderRadius: isFeatured ? 18 : 14,
        fontSize: isFeatured ? 30 : 26,
        background: action.gradient + '25',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: isFeatured ? 0 : 16,
        flexShrink: 0,
      }}>
        {action.icon}
      </div>

      {/* Text */}
      <div style={{ flex: isFeatured ? 1 : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#e8eaf2' }}>{action.title}</span>
          {action.fireflies && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px',
              background: 'rgba(124,58,237,0.2)', color: '#a78bfa',
              borderRadius: 99, letterSpacing: '0.3px',
            }}>
              🎙️ Fireflies
            </span>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#8b92a8', lineHeight: 1.5 }}>{action.desc}</div>
        {isFeatured && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {(action.combineType === 'meetings'
              ? ['Meeting Minutes', 'Deep Analysis', 'Action Items']
              : ['Format Note', 'Summarize', 'Key Points']
            ).map(tag => (
              <span key={tag} style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, color: '#454e68' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: action.gradient,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />
    </div>
  );
}
