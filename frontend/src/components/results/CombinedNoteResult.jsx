import { useState } from 'react';
import { ResultCard, Section, SectionTitle, BulletList, Badge } from './shared';

export default function CombinedNoteResult({ noteData, summarizeData }) {
  const [tab, setTab] = useState('note');

  return (
    <div>
      <div style={s.tabs}>
        <button onClick={() => setTab('note')} style={{ ...s.tab, ...(tab === 'note' ? s.tabActive : {}) }}>
          📝 Formatted Note
        </button>
        <button onClick={() => setTab('summary')} style={{ ...s.tab, ...(tab === 'summary' ? s.tabActive : {}) }}>
          📋 Summary
        </button>
      </div>

      {tab === 'note' && noteData && (
        <ResultCard>
          {noteData.title && <div style={s.title}>{noteData.title}</div>}
          {noteData.formatted_text && <p style={s.text}>{noteData.formatted_text}</p>}
          {noteData.bullets?.length > 0 && (
            <Section title="Key Points">
              <BulletList items={noteData.bullets} />
            </Section>
          )}
        </ResultCard>
      )}

      {tab === 'summary' && summarizeData && (
        <ResultCard>
          {summarizeData.topic && <Badge>📌 {summarizeData.topic}</Badge>}
          <p style={s.text}>{summarizeData.summary}</p>
          {summarizeData.key_points?.length > 0 && (
            <Section title="Key Points">
              <BulletList items={summarizeData.key_points} />
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
    background: '#04091c', borderRadius: 14, padding: 5,
    border: '1px solid rgba(26,95,212,0.18)',
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
  title: { fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#dce8ff' },
  text: { fontSize: 16, lineHeight: 1.8, color: '#6b8fc4' },
};
