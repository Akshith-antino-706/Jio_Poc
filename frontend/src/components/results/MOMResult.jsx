import { ResultCard, Section, SectionTitle, BulletList, PillGroup, ActionItemsTable } from './shared';

export default function MOMResult({ data }) {
  return (
    <ResultCard>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{data.title || 'Meeting Minutes'}</div>
      {data.date && <div style={{ fontSize: 12, color: '#454e68', marginBottom: 16 }}>📅 {data.date}</div>}

      {data.attendees?.length > 0 && (
        <Section title="Attendees">
          <PillGroup items={data.attendees} getLabel={a => '👤 ' + a} />
        </Section>
      )}

      {data.agenda?.length > 0 && (
        <Section title="Agenda">
          <BulletList items={data.agenda} />
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

      {data.next_steps?.length > 0 && (
        <Section title="Next Steps">
          <BulletList items={data.next_steps} />
        </Section>
      )}
    </ResultCard>
  );
}
