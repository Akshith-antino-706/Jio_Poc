import { ResultCard, Section, PillGroup } from './shared';

export default function DictionaryResult({ data }) {
  return (
    <ResultCard>
      <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4, color: '#e8eaf2' }}>
        {data.word}
      </div>

      {data.part_of_speech && (
        <div style={{ fontSize: 13, color: '#6366f1', fontStyle: 'italic', marginBottom: 16 }}>
          {data.part_of_speech}
        </div>
      )}

      <p style={{ fontSize: 15, lineHeight: 1.75, color: '#c4c8d8', marginBottom: 18 }}>
        {data.definition}
      </p>

      {data.example && (
        <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: 16, color: '#8b92a8', fontStyle: 'italic', fontSize: 13, lineHeight: 1.7, marginBottom: 4 }}>
          "{data.example}"
        </div>
      )}

      {data.synonyms?.length > 0 && (
        <Section title="Synonyms">
          <PillGroup items={data.synonyms} />
        </Section>
      )}
    </ResultCard>
  );
}
