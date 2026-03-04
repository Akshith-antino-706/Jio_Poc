import { useState, useEffect } from 'react';
import { ACTIONS } from '../config/actions';
import JioLogo from '../assets/JioLogo';

export default function Sidebar({ activeId, onSelect }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside style={s.sidebar}>
      {/* Logo */}
      <div style={s.logoSection}>
        <JioLogo size={38} />
        <div>
          <div style={s.logoTitle}>Jio jee bharke</div>
          <div style={s.logoSub}>AI Intelligence Suite</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Nav section */}
      <div style={s.sectionLabel}>AI TOOLS</div>
      <nav style={s.nav}>
        {ACTIONS.map(action => (
          <NavItem
            key={action.id}
            action={action}
            active={activeId === action.id}
            onClick={() => onSelect(action)}
          />
        ))}
      </nav>

      {/* Bottom status */}
      <div style={s.bottom}>
        <div style={s.divider} />
        <div style={s.statusRow}>
          <div style={s.statusLeft}>
            <span style={s.dot} />
            <span style={s.statusText}>AI Online</span>
          </div>
          <span style={s.clock}>{time}</span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ action, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...s.navItem,
        background: active
          ? 'rgba(26,95,212,0.18)'
          : hovered
          ? 'rgba(26,95,212,0.09)'
          : 'transparent',
        borderLeft: active ? `3px solid ${action.color}` : '3px solid transparent',
      }}
    >
      {/* Icon box */}
      <div
        style={{
          ...s.navIconBox,
          background: active
            ? action.color + '28'
            : hovered
            ? 'rgba(26,95,212,0.14)'
            : 'rgba(26,95,212,0.07)',
        }}
      >
        <span style={s.navEmoji}>{action.icon}</span>
      </div>

      {/* Label */}
      <span
        style={{
          ...s.navLabel,
          color: active ? '#dce8ff' : hovered ? '#a8c4f0' : '#5a7aaa',
          fontWeight: active ? 600 : 400,
        }}
      >
        {action.title}
      </span>

      {/* Fireflies badge */}
      {action.fireflies && (
        <span style={s.badge}>🎙️</span>
      )}
    </button>
  );
}

const s = {
  sidebar: {
    width: 220,
    flexShrink: 0,
    height: '100vh',
    background: '#060d24',
    borderRight: '1px solid rgba(26,95,212,0.18)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 16px',
    position: 'relative',
    overflow: 'hidden',
  },

  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 18px 18px',
  },
  logoTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '-0.1px',
    color: '#dce8ff',
  },
  logoSub: {
    fontSize: 10,
    color: '#3a5580',
    marginTop: 1,
    letterSpacing: '0.3px',
  },

  divider: {
    height: 1,
    background: 'rgba(26,95,212,0.15)',
    margin: '0 14px',
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#3a5580',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    padding: '16px 20px 8px',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '0 10px',
    flex: 1,
  },

  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 10px 10px 8px',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    marginLeft: -3,
  },

  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s ease',
  },
  navEmoji: {
    fontSize: 15,
    lineHeight: 1,
  },

  navLabel: {
    fontSize: 13,
    flex: 1,
    transition: 'color 0.15s ease',
    fontFamily: 'Inter, sans-serif',
  },

  badge: {
    fontSize: 10,
    flexShrink: 0,
  },

  bottom: {
    paddingTop: 8,
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px 4px',
  },
  statusLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    display: 'inline-block',
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 6px #10b981',
    animation: 'pulse 2s infinite',
  },
  statusText: {
    fontSize: 11,
    color: '#3a5580',
  },
  clock: {
    fontSize: 11,
    color: '#3a5580',
    fontVariantNumeric: 'tabular-nums',
  },
};
