import { ResultCard, SectionTitle, BulletList } from './shared';

export default function NoteResult({ data }) {
  return (
    <ResultCard>
      {data.title && <div style={s.title}>{data.title}</div>}
      {data.formatted_text && <p style={s.text}>{data.formatted_text}</p>}
      {data.bullets?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <SectionTitle>Key Points</SectionTitle>
          <BulletList items={data.bullets} />
        </div>
      )}
    </ResultCard>
  );
}

const s = {
  title: { fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#e8eaf2' },
  text: { fontSize: 14, lineHeight: 1.75, color: '#8b92a8' },
};
