import { useState, useRef, useEffect } from 'react';
import { Section, BulletList, PillGroup, ActionItemsTable, ResultCard } from './shared';

function buildMinutesText(d) {
  const lines = [];
  if (d.title) lines.push(`MEETING MINUTES: ${d.title}`);
  if (d.date)  lines.push(`Date: ${d.date}`);
  lines.push('');
  if (d.attendees?.length)     lines.push(`Attendees: ${d.attendees.join(', ')}`, '');
  if (d.agenda?.length)        lines.push('AGENDA:', ...d.agenda.map(i => `  • ${i}`), '');
  if (d.key_decisions?.length) lines.push('KEY DECISIONS:', ...d.key_decisions.map(i => `  • ${i}`), '');
  if (d.action_items?.length) {
    lines.push('ACTION ITEMS:');
    d.action_items.forEach(i => lines.push(`  • ${i.task} — ${i.owner} (by ${i.deadline || 'TBD'})`));
    lines.push('');
  }
  if (d.next_steps?.length)    lines.push('NEXT STEPS:', ...d.next_steps.map(i => `  • ${i}`));
  return lines.join('\n');
}

const MAIL_CLIENTS = [
  {
    id: 'gmail',
    label: 'Gmail',
    icon: '📧',
    color: '#EA4335',
    url: (to, subject, body) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
  {
    id: 'outlook',
    label: 'Outlook',
    icon: '📨',
    color: '#0078D4',
    url: (to, subject, body) =>
      `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
  {
    id: 'mail',
    label: 'System Mail',
    icon: '✉️',
    color: '#8b92a8',
    url: (to, subject, body) =>
      `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  },
];

function MailClientPicker({ subject, body, onClose }) {
  const [to, setTo] = useState('');
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function open(client) {
    const url = client.url(to, subject, body);
    if (client.id === 'mail') {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
    onClose();
  }

  return (
    <div ref={ref} style={s.picker}>
      <div style={s.pickerLabel}>Send to</div>
      <input
        type="email"
        value={to}
        onChange={e => setTo(e.target.value)}
        placeholder="Recipient email (optional)"
        style={s.pickerInput}
        autoFocus
      />
      <div style={s.pickerDivider} />
      {MAIL_CLIENTS.map(client => (
        <button key={client.id} onClick={() => open(client)} style={s.clientRow}>
          <span style={{ fontSize: 16 }}>{client.icon}</span>
          <span style={{ flex: 1, textAlign: 'left' }}>{client.label}</span>
          <span style={{ fontSize: 10, color: client.color, fontWeight: 600 }}>Open ↗</span>
        </button>
      ))}
    </div>
  );
}

export default function CombinedMeetingResult({ momData, meetingData }) {
  const [tab, setTab]           = useState('minutes');
  const [showPicker, setShowPicker] = useState(false);

  const subject = momData
    ? `Meeting Minutes${momData.title ? ': ' + momData.title : ''}${momData.date ? ' — ' + momData.date : ''}`
    : 'Meeting Minutes';
  const body = momData ? buildMinutesText(momData) : '';

  return (
    <div>
      {/* Tabs */}
      <div style={s.tabs}>
        <button onClick={() => setTab('minutes')} style={{ ...s.tab, ...(tab === 'minutes' ? s.tabActive : {}) }}>
          🗒️ Meeting Minutes
        </button>
        <button onClick={() => setTab('intel')} style={{ ...s.tab, ...(tab === 'intel' ? s.tabActive : {}) }}>
          🎯 Deep Analysis
        </button>
      </div>

      {/* Minutes tab */}
      {tab === 'minutes' && momData && (
        <ResultCard>
          {/* Header row with title + email button */}
          <div style={s.titleRow}>
            <div>
              <div style={s.title}>{momData.title || 'Meeting Minutes'}</div>
              {momData.date && <div style={s.date}>📅 {momData.date}</div>}
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowPicker(v => !v)}
                style={{ ...s.emailBtn, background: showPicker ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.1)' }}
              >
                📬 Email
              </button>
              {showPicker && (
                <MailClientPicker
                  subject={subject}
                  body={body}
                  onClose={() => setShowPicker(false)}
                />
              )}
            </div>
          </div>

          {momData.attendees?.length > 0 && (
            <Section title="Attendees">
              <PillGroup items={momData.attendees} getLabel={a => '👤 ' + a} />
            </Section>
          )}
          {momData.agenda?.length > 0 && (
            <Section title="Agenda">
              <BulletList items={momData.agenda} />
            </Section>
          )}
          {momData.key_decisions?.length > 0 && (
            <Section title="Key Decisions">
              <BulletList items={momData.key_decisions} />
            </Section>
          )}
          {momData.action_items?.length > 0 && (
            <Section title="Action Items">
              <ActionItemsTable items={momData.action_items} />
            </Section>
          )}
          {momData.next_steps?.length > 0 && (
            <Section title="Next Steps">
              <BulletList items={momData.next_steps} />
            </Section>
          )}
        </ResultCard>
      )}

      {/* Intel tab */}
      {tab === 'intel' && meetingData && (
        <ResultCard>
          {meetingData.summary && (
            <Section title="Summary">
              <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6b8fc4' }}>{meetingData.summary}</p>
            </Section>
          )}
          {meetingData.participants?.length > 0 && (
            <Section title="Participants">
              <PillGroup items={meetingData.participants} getLabel={p => '👤 ' + p} />
            </Section>
          )}
          {meetingData.key_decisions?.length > 0 && (
            <Section title="Key Decisions">
              <BulletList items={meetingData.key_decisions} />
            </Section>
          )}
          {meetingData.action_items?.length > 0 && (
            <Section title="Action Items">
              <ActionItemsTable items={meetingData.action_items} />
            </Section>
          )}
          {meetingData.highlights?.length > 0 && (
            <Section title="Highlights">
              <BulletList items={meetingData.highlights} />
            </Section>
          )}
        </ResultCard>
      )}
    </div>
  );
}

const s = {
  tabs: {
    display: 'flex', gap: 6, marginBottom: 20,
    background: '#04091c', borderRadius: 14,
    padding: 5, border: '1px solid rgba(26,95,212,0.18)',
  },
  tab: {
    flex: 1, padding: '13px 20px', borderRadius: 11, border: 'none',
    background: 'transparent', color: '#5a7aaa', fontSize: 15,
    fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#0b1a3a', color: '#dce8ff',
    boxShadow: '0 2px 8px rgba(0,20,80,0.4)',
  },

  titleRow: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 16, marginBottom: 6,
  },
  title: { fontSize: 24, fontWeight: 700, color: '#dce8ff', marginBottom: 6 },
  date: { fontSize: 14, color: '#3a5580', marginBottom: 16 },

  emailBtn: {
    padding: '9px 18px', border: '1px solid rgba(26,95,212,0.3)',
    borderRadius: 10, color: '#7ab0f0', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s', whiteSpace: 'nowrap',
    background: 'rgba(26,95,212,0.1)',
  },

  /* Picker dropdown */
  picker: {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
    width: 240, background: '#0b1a3a',
    border: '1px solid rgba(26,95,212,0.25)',
    borderRadius: 14, padding: 12, zIndex: 300,
    boxShadow: '0 12px 40px rgba(0,20,80,0.7)',
  },
  pickerLabel: {
    fontSize: 10, fontWeight: 700, color: '#3a5580',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8,
  },
  pickerInput: {
    width: '100%', background: '#071228',
    border: '1px solid rgba(26,95,212,0.18)', borderRadius: 8,
    color: '#dce8ff', fontFamily: 'Inter, sans-serif',
    fontSize: 12, padding: '7px 10px', outline: 'none',
    marginBottom: 10,
  },
  pickerDivider: {
    height: 1, background: 'rgba(26,95,212,0.15)', marginBottom: 8,
  },
  clientRow: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 10px', background: 'transparent',
    border: 'none', borderRadius: 8, color: '#dce8ff',
    fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'background 0.15s',
    marginBottom: 2,
  },
};
