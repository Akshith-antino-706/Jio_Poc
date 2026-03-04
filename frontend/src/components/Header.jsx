import { useEffect, useState } from 'react';

export default function Header() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🧠</div>
        <div>
          <div style={styles.logoTitle}>CXO AI Hub</div>
          <div style={styles.logoSub}>Intelligence Suite</div>
        </div>
      </div>
      <div style={styles.right}>
        <span style={styles.dot} />
        <span style={styles.clock}>{time}</span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(8,10,18,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10, fontSize: 20,
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoTitle: { fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: '#e8eaf2' },
  logoSub: { fontSize: 12, color: '#8b92a8', marginTop: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: {
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: '#10b981', boxShadow: '0 0 8px #10b981',
    animation: 'pulse 2s infinite',
  },
  clock: { fontSize: 13, color: '#8b92a8', fontVariantNumeric: 'tabular-nums' },
};
