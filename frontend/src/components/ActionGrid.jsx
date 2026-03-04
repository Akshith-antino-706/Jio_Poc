import ActionCard from './ActionCard';
import { ACTIONS } from '../config/actions';

export default function ActionGrid({ onSelect }) {
  return (
    <main style={styles.main}>
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Your AI Intelligence Suite</h2>
        <p style={styles.heroSub}>AI-powered productivity suite</p>
      </div>
      <div style={styles.grid}>
        {ACTIONS.map(action => (
          <ActionCard key={action.id} action={action} onClick={onSelect} />
        ))}
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100%',
    padding: '48px 36px 48px',
  },
  hero: {
    marginBottom: 36,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '-0.8px',
    background: 'linear-gradient(135deg, #e8eaf2 30%, #8b92a8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: '#8b92a8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
    maxWidth: 960,
  },
};
