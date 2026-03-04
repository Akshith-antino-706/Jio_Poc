import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ActionPanel from './components/ActionPanel';

export default function App() {
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flex: 1, minWidth: 0 }}>
      <Sidebar activeId={selectedAction?.id} onSelect={setSelectedAction} />
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: '#04091c' }}>
        <ActionPanel action={selectedAction} />
      </div>
    </div>
  );
}
