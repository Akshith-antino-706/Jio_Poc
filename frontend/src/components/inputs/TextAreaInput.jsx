export default function TextAreaInput({ value, onChange, placeholder, label }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={11}
        style={styles.textarea}
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
  textarea: {
    width: '100%', background: '#12151f',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, color: '#e8eaf2',
    fontFamily: 'Inter, sans-serif', fontSize: 15,
    padding: '18px 20px', resize: 'none', outline: 'none',
    lineHeight: 1.7, transition: 'border-color 0.2s',
  },
};
