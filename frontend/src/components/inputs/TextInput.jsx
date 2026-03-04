export default function TextInput({ value, onChange, placeholder, label, onEnter }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
      />
    </div>
  );
}

const styles = {
  label: {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#454e68',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10,
  },
  input: {
    width: '100%', background: '#12151f',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, color: '#e8eaf2',
    fontFamily: 'Inter, sans-serif', fontSize: 17,
    padding: '18px 20px', outline: 'none', transition: 'border-color 0.2s',
  },
};
