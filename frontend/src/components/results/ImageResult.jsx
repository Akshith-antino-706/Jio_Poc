import { ResultCard, Badge, Section } from './shared';

export default function ImageResult({ data }) {
  return (
    <ResultCard>
      {data.structure_type && <Badge>📄 {data.structure_type}</Badge>}

      {data.extracted_text && (
        <Section title="Extracted Text">
          <div style={{ fontSize: 13, lineHeight: 1.8, color: '#8b92a8', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {data.extracted_text}
          </div>
        </Section>
      )}

      {data.sections?.length > 0 && (
        <Section title="Structured Content">
          {data.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              {sec.heading && <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#e8eaf2' }}>{sec.heading}</div>}
              <div style={{ fontSize: 13, lineHeight: 1.7, color: '#8b92a8' }}>{sec.content}</div>
            </div>
          ))}
        </Section>
      )}
    </ResultCard>
  );
}
