import { ResultCard, Badge, SectionTitle, BulletList } from './shared';

export default function SummarizeResult({ data }) {
  return (
    <ResultCard>
      {data.topic && <Badge>📌 {data.topic}</Badge>}
      <p style={{ fontSize: 15, lineHeight: 1.75, color: '#c4c8d8' }}>{data.summary}</p>
      {data.key_points?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <SectionTitle>Key Points</SectionTitle>
          <BulletList items={data.key_points} />
        </div>
      )}
    </ResultCard>
  );
}
