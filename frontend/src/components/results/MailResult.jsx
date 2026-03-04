import { useState } from 'react';

function openMailClient(to, subject, body) {
  const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

export default function MailResult({ data }) {
  const [to, setTo] = useState('');

  const fullBody = [data.greeting, '', data.body, '', data.sign_off].join('\n');

  return (
    <div>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.subject}>📧 {data.subject}</div>
          <div style={s.tone}>Tone: {data.tone || 'professional'}</div>
        </div>
        <div style={s.body}>
          <div style={s.greeting}>{data.greeting}</div>
          <div style={s.content}>{data.body}</div>
          <div style={s.signOff}>{data.sign_off}</div>
        </div>
      </div>

      {/* Open in Mail section */}
      <div style={s.mailBar}>
        <input
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="Recipient email (optional)"
          style={s.toInput}
          onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
        />
        <button
          onClick={() => openMailClient(to, data.subject, fullBody)}
          style={s.openBtn}
        >
          📬 Open in Mail
        </button>
      </div>
    </div>
  );
}

const s = {
  card: {
    background: '#12151f', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, overflow: 'hidden',
  },
  header: {
    background: 'rgba(255,255,255,0.03)', padding: '16px 22px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  subject: { fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#e8eaf2' },
  tone: { fontSize: 11, color: '#454e68', textTransform: 'capitalize' },
  body: { padding: '22px 22px 24px' },
  greeting: { fontWeight: 600, marginBottom: 14, fontSize: 14, color: '#e8eaf2' },
  content: { fontSize: 14, lineHeight: 1.8, color: '#8b92a8', marginBottom: 18 },
  signOff: { fontSize: 13, color: '#454e68', fontStyle: 'italic', whiteSpace: 'pre-line' },

  mailBar: {
    display: 'flex', gap: 10, marginTop: 12, alignItems: 'center',
    background: '#12151f', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '12px 16px',
  },
  toInput: {
    flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8, color: '#e8eaf2', fontFamily: 'Inter, sans-serif',
    fontSize: 13, padding: '8px 12px', outline: 'none', transition: 'border-color 0.2s',
  },
  openBtn: {
    padding: '9px 18px', background: 'linear-gradient(135deg,#f59e0b,#d97706)',
    border: 'none', borderRadius: 8, color: 'white', fontSize: 13,
    fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
  },
};
