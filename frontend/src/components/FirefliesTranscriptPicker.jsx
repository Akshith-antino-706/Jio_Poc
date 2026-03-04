import { useState, useEffect } from 'react';
import { getTranscripts, getTranscript, formatTranscript, formatDuration, formatDate } from '../services/fireflies';

export default function FirefliesTranscriptPicker({ open, onClose, onSelect }) {
  const [transcripts, setTranscripts]   = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState(null);   // transcript detail
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [summaryOpen, setSummaryOpen]   = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setSearch('');
    setError(null);
    setLoading(true);
    getTranscripts()
      .then(setTranscripts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  async function handleSelect(t) {
    setLoadingDetail(true);
    setSummaryOpen(false);
    try {
      const detail = await getTranscript(t.id);
      setSelected(detail);
    } catch (e) {
      setError('Failed to load transcript: ' + e.message);
    } finally {
      setLoadingDetail(false);
    }
  }

  function handleImport() {
    if (!selected) return;
    const text = formatTranscript(selected.sentences);
    onSelect(text, selected.title);
    onClose();
  }

  const filtered = transcripts.filter(t =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.panel} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <span style={s.logo}>🎙️</span>
            <div>
              <div style={s.title}>Fireflies Meetings</div>
              <div style={s.subtitle}>Select a meeting to import its transcript</div>
            </div>
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <div style={s.body}>
          {/* Left: meeting list */}
          <div style={s.listCol}>
            <input
              style={s.search}
              placeholder="Search meetings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
            />

            <div style={s.list}>
              {loading && (
                <>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={s.skeleton}>
                      <div style={{ ...s.skLine, width: '60%' }} />
                      <div style={{ ...s.skLine, width: '40%', marginTop: 6 }} />
                    </div>
                  ))}
                </>
              )}

              {error && (
                <div style={s.errorBox}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>⚠️ Connection Error</div>
                  <div style={{ fontSize: 12, color: '#fca5a5' }}>{error}</div>
                  {error.includes('CORS') || error.includes('fetch') ? (
                    <div style={{ fontSize: 11, color: '#f87171', marginTop: 8 }}>
                      Fireflies API may not allow direct browser access. Try enabling CORS or using a proxy.
                    </div>
                  ) : null}
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: '#454e68', fontSize: 13 }}>
                  {search ? 'No meetings match your search' : 'No meetings found'}
                </div>
              )}

              {filtered.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  style={{
                    ...s.meetingRow,
                    background: selected?.id === t.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                    borderColor: selected?.id === t.id ? 'rgba(99,102,241,0.3)' : 'transparent',
                  }}
                >
                  <div style={s.meetingTitle}>{t.title || 'Untitled Meeting'}</div>
                  <div style={s.meetingMeta}>
                    {t.date && <span>📅 {formatDate(t.date)}</span>}
                    {t.duration && <span>⏱ {formatDuration(t.duration)}</span>}
                    {t.participants?.length > 0 && <span>👥 {t.participants.length}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: transcript detail */}
          <div style={s.detailCol}>
            {!selected && !loadingDetail && (
              <div style={s.emptyDetail}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎙️</div>
                <div style={{ fontSize: 14, color: '#8b92a8' }}>Select a meeting to preview</div>
              </div>
            )}

            {loadingDetail && (
              <div style={s.emptyDetail}>
                <div style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <div style={{ fontSize: 13, color: '#8b92a8', marginTop: 12 }}>Loading transcript...</div>
              </div>
            )}

            {selected && !loadingDetail && (
              <>
                <div style={s.detailHeader}>
                  <div style={s.detailTitle}>{selected.title}</div>
                  <div style={s.detailMeta}>
                    {selected.date && formatDate(selected.date)}
                    {selected.duration && ` · ${formatDuration(selected.duration)}`}
                    {selected.participants?.length > 0 && ` · ${selected.participants.length} participants`}
                  </div>
                </div>

                {/* Fireflies AI Summary (collapsible) */}
                {selected.summary?.overview && (
                  <div style={s.summaryBox}>
                    <button onClick={() => setSummaryOpen(v => !v)} style={s.summaryToggle}>
                      <span>✨ Fireflies AI Summary</span>
                      <span>{summaryOpen ? '▴' : '▾'}</span>
                    </button>
                    {summaryOpen && (
                      <div style={s.summaryContent}>
                        <p style={{ fontSize: 13, color: '#8b92a8', lineHeight: 1.7 }}>{selected.summary.overview}</p>
                        {selected.summary.action_items?.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 10, color: '#454e68', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Action Items</div>
                            <ul style={{ listStyle: 'none', fontSize: 12, color: '#8b92a8' }}>
                              {selected.summary.action_items.map((ai, i) => (
                                <li key={i} style={{ padding: '3px 0' }}>▸ {ai}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Transcript preview */}
                <div style={s.transcriptLabel}>Transcript Preview</div>
                <div style={s.transcriptPreview}>
                  {selected.sentences?.slice(0, 20).map((s, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      <span style={{ color: '#6366f1', fontWeight: 600, fontSize: 12 }}>{s.speaker_name}: </span>
                      <span style={{ color: '#8b92a8', fontSize: 12 }}>{s.text}</span>
                    </div>
                  ))}
                  {selected.sentences?.length > 20 && (
                    <div style={{ color: '#454e68', fontSize: 11, marginTop: 8 }}>
                      + {selected.sentences.length - 20} more lines...
                    </div>
                  )}
                </div>

                <button onClick={handleImport} style={s.importBtn}>
                  Import Transcript →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  panel: {
    background: '#0d0f1a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, width: '100%', maxWidth: 900, maxHeight: '85vh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: {
    width: 42, height: 42, borderRadius: 12, fontSize: 20,
    background: 'linear-gradient(135deg,#7c3aed,#6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 17, fontWeight: 700, color: '#e8eaf2' },
  subtitle: { fontSize: 12, color: '#8b92a8', marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent', color: '#8b92a8', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  body: {
    display: 'flex', flex: 1, overflow: 'hidden',
  },
  listCol: {
    width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', flexDirection: 'column', padding: 16,
  },
  search: {
    width: '100%', background: '#12151f', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, color: '#e8eaf2', fontFamily: 'Inter, sans-serif',
    fontSize: 13, padding: '10px 14px', outline: 'none',
    marginBottom: 12, transition: 'border-color 0.2s',
  },
  list: { overflowY: 'auto', flex: 1 },
  skeleton: { padding: '12px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  skLine: {
    height: 12, borderRadius: 6,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 10, padding: '14px 16px', margin: '4px 0',
    color: '#fca5a5', fontSize: 13,
  },
  meetingRow: {
    padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
    border: '1px solid', marginBottom: 4, transition: 'all 0.15s',
  },
  meetingTitle: { fontSize: 13, fontWeight: 500, color: '#e8eaf2', marginBottom: 4, lineHeight: 1.4 },
  meetingMeta: { display: 'flex', gap: 10, fontSize: 11, color: '#454e68' },
  detailCol: {
    flex: 1, padding: 24, overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
  },
  emptyDetail: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', color: '#454e68',
  },
  detailHeader: { marginBottom: 16 },
  detailTitle: { fontSize: 18, fontWeight: 700, color: '#e8eaf2', marginBottom: 4 },
  detailMeta: { fontSize: 12, color: '#454e68' },
  summaryBox: {
    background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 12, marginBottom: 16, overflow: 'hidden',
  },
  summaryToggle: {
    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 14px', background: 'none', border: 'none',
    color: '#a5b4fc', fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
  summaryContent: { padding: '0 14px 14px' },
  transcriptLabel: {
    fontSize: 10, fontWeight: 700, color: '#454e68',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10,
  },
  transcriptPreview: {
    background: '#080a12', borderRadius: 10, padding: '14px 16px',
    flex: 1, overflowY: 'auto', marginBottom: 20,
    border: '1px solid rgba(255,255,255,0.05)',
    lineHeight: 1.6,
  },
  importBtn: {
    padding: '13px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    border: 'none', borderRadius: 12, color: 'white', fontSize: 14,
    fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'Inter, sans-serif',
  },
};
