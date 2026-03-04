import { ResultCard, Section, BulletList, PillGroup, ActionItemsTable } from './shared';

export default function MeetingResult({ data }) {
  return (
    <ResultCard>
      {data.summary && (
        <Section title="Summary">
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#8b92a8' }}>{data.summary}</p>
        </Section>
      )}

      {data.participants?.length > 0 && (
        <Section title="Participants">
          <PillGroup items={data.participants} getLabel={p => '👤 ' + p} />
        </Section>
      )}

      {data.key_decisions?.length > 0 && (
        <Section title="Key Decisions">
          <BulletList items={data.key_decisions} />
        </Section>
      )}

      {data.action_items?.length > 0 && (
        <Section title="Action Items">
          <ActionItemsTable items={data.action_items} />
        </Section>
      )}

      {data.highlights?.length > 0 && (
        <Section title="Highlights">
          <BulletList items={data.highlights} />
        </Section>
      )}
    </ResultCard>
  );
}
