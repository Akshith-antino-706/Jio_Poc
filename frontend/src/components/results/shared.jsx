export function ResultCard({ children }) {
  return <div style={{ background: '#0b1a3a', border: '1px solid rgba(26,95,212,0.2)', borderRadius: 20, padding: '32px 36px' }}>{children}</div>;
}

export function SectionTitle({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: '#3a5580', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>{children}</div>;
}

export function BulletList({ items }) {
  return (
    <ul style={{ listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < items.length - 1 ? '1px solid rgba(26,95,212,0.12)' : 'none', fontSize: 15, color: '#6b8fc4', alignItems: 'flex-start', lineHeight: 1.6 }}>
          <span style={{ color: '#1a6fe0', flexShrink: 0, marginTop: 2 }}>▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PillGroup({ items, getLabel }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {items.map((item, i) => (
        <span key={i} style={{ padding: '6px 16px', background: 'rgba(26,95,212,0.12)', border: '1px solid rgba(26,95,212,0.22)', borderRadius: 99, fontSize: 14, color: '#7ab0f0' }}>
          {getLabel ? getLabel(item) : item}
        </span>
      ))}
    </div>
  );
}

export function Badge({ children, color = 'rgba(26,95,212,0.15)', textColor = '#7ab0f0' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, background: color, color: textColor, marginBottom: 18 }}>
      {children}
    </span>
  );
}

export function ActionItemsTable({ items }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
      <thead>
        <tr>
          {['Task', 'Owner', 'Deadline'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '8px 14px', color: '#3a5580', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(26,95,212,0.15)' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td style={{ padding: '13px 14px', borderBottom: i < items.length - 1 ? '1px solid rgba(26,95,212,0.1)' : 'none', color: '#6b8fc4' }}>{item.task}</td>
            <td style={{ padding: '13px 14px', borderBottom: i < items.length - 1 ? '1px solid rgba(26,95,212,0.1)' : 'none' }}>
              <span style={{ padding: '3px 10px', background: 'rgba(26,95,212,0.15)', color: '#7ab0f0', borderRadius: 99, fontSize: 13 }}>{item.owner}</span>
            </td>
            <td style={{ padding: '13px 14px', borderBottom: i < items.length - 1 ? '1px solid rgba(26,95,212,0.1)' : 'none' }}>
              <span style={{ padding: '3px 10px', background: 'rgba(245,158,11,0.15)', color: '#fcd34d', borderRadius: 99, fontSize: 13 }}>{item.deadline || '—'}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Section({ title, children }) {
  return (
    <div style={{ marginTop: 28 }}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}
