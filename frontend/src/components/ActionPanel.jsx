import { useState, useEffect, useRef } from 'react';
import FirefliesTranscriptPicker from './FirefliesTranscriptPicker';
import { JioLogo } from '../assets/BouncingLogos';

const SIZE = 90;

function BouncingLogo() {
  const containerRef = useRef(null);
  const posRef       = useRef({ x: 120, y: 80 });
  const velRef       = useRef({ x: 1.5, y: 1.1 });
  const [pos, setPos] = useState({ x: 120, y: 80 });

  useEffect(() => {
    let animId;
    function tick() {
      const el = containerRef.current;
      if (!el) return;
      const maxX = el.clientWidth  - SIZE;
      const maxY = el.clientHeight - SIZE;
      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;
      if (posRef.current.x <= 0 || posRef.current.x >= maxX) {
        velRef.current.x *= -1;
        posRef.current.x = Math.max(0, Math.min(maxX, posRef.current.x));
      }
      if (posRef.current.y <= 0 || posRef.current.y >= maxY) {
        velRef.current.y *= -1;
        posRef.current.y = Math.max(0, Math.min(maxY, posRef.current.y));
      }
      setPos({ x: posRef.current.x, y: posRef.current.y });
      animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: pos.x, top: pos.y, opacity: 0.75 }}>
        <JioLogo size={SIZE} />
      </div>
    </div>
  );
}

import TextAreaInput from './inputs/TextAreaInput';
import TextInput from './inputs/TextInput';
import FileInput from './inputs/FileInput';

import NoteResult from './results/NoteResult';
import SummarizeResult from './results/SummarizeResult';
import MailResult from './results/MailResult';
import ImageResult from './results/ImageResult';
import DictionaryResult from './results/DictionaryResult';
import FlowchartResult from './results/FlowchartResult';
import CombinedMeetingResult from './results/CombinedMeetingResult';
import CombinedNoteResult from './results/CombinedNoteResult';

const API = 'https://workflow.antino.ca/webhook/cxo/process';

async function callAPI(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export default function ActionPanel({ action }) {
  const [value, setValue]                 = useState('');
  const [fileB64, setFileB64]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [result, setResult]               = useState(null);
  const [error, setError]                 = useState(null);
  const [copied, setCopied]               = useState(false);
  const [showFireflies, setShowFireflies] = useState(false);
  const flowchartRef                      = useRef(null);

  useEffect(() => {
    setValue('');
    setFileB64(null);
    setResult(null);
    setError(null);
    setShowFireflies(false);
  }, [action?.id]);

  async function handleSubmit() {
    if (!action) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      if (action.isCombined) {
        const text = value.trim();
        if (action.combineType === 'notes') {
          const [noteRes, sumRes] = await Promise.all([
            callAPI({ action: 'note',      content: text }),
            callAPI({ action: 'summarize', content: text }),
          ]);
          const noteData      = noteRes.success ? noteRes : null;
          const summarizeData = sumRes.success  ? sumRes  : null;
          if (!noteData && !summarizeData) {
            setError(noteRes.error || sumRes.error || 'Both actions failed');
          } else {
            setResult({ combined: true, combineType: 'notes', noteData, summarizeData });
          }
        } else {
          const [meetingRes, momRes] = await Promise.all([
            callAPI({ action: 'meeting', transcript: text }),
            callAPI({ action: 'mom',     content: text }),
          ]);
          const meetingData = meetingRes.success ? meetingRes : null;
          const momData     = momRes.success     ? momRes     : null;
          if (!meetingData && !momData) {
            setError(meetingRes.error || momRes.error || 'Both actions failed');
          } else {
            setResult({ combined: true, combineType: 'meetings', meetingData, momData });
          }
        }
      } else {
        const payload = { action: action.id };
        if (action.inputType === 'file') {
          payload.image = fileB64;
        } else {
          payload[action.field] = value.trim();
        }
        const data = await callAPI(payload);
        if (!data.success) {
          setError(data.error || 'AI request failed');
        } else {
          setResult({ combined: false, data });
        }
      }
    } catch (e) {
      setError('Connection error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    if (action?.id === 'flowchart') {
      flowchartRef.current?.copyImage();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    let text = '';
    if (result.combined) {
      const d = result.momData;
      if (d) {
        text = `${d.title}\n\nAttendees: ${d.attendees?.join(', ')}\n\nKey Decisions:\n${d.key_decisions?.map(x => '• ' + x).join('\n')}\n\nAction Items:\n${d.action_items?.map(i => `• ${i.task} — ${i.owner} by ${i.deadline}`).join('\n')}`;
      }
    } else {
      text = buildCopyText(action, result.data);
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const canSubmit = action?.inputType === 'file' ? !!fileB64 : value.trim().length > 0;

  // Empty state — bouncing screensaver
  if (!action) {
    return <BouncingLogo />;
  }

  return (
    <>
      <FirefliesTranscriptPicker
        open={showFireflies}
        onClose={() => setShowFireflies(false)}
        onSelect={(transcript) => { setValue(transcript); setShowFireflies(false); }}
      />

      <div style={s.panel}>
        {/* Action header */}
        <div style={s.header}>
          <div
            style={{
              ...s.iconBox,
              background: action.gradient + '28',
            }}
          >
            {action.icon}
          </div>
          <div>
            <div style={s.title}>{action.title}</div>
            <div style={s.desc}>{action.desc}</div>
          </div>
          {action.fireflies && (
            <span style={s.fireflyBadge}>🎙️ Fireflies</span>
          )}
        </div>

        <div style={s.divider} />

        {/* Fireflies import */}
        {action.fireflies && (
          <button
            onClick={() => setShowFireflies(true)}
            style={s.fireflyBtn}
          >
            <span>🎙️</span>
            Import from Fireflies
          </button>
        )}

        {/* Input */}
        {action.inputType === 'textarea' && (
          <TextAreaInput value={value} onChange={setValue} label={action.label} placeholder={action.placeholder} />
        )}
        {action.inputType === 'text' && (
          <TextInput value={value} onChange={setValue} label={action.label} placeholder={action.placeholder} onEnter={handleSubmit} />
        )}
        {action.inputType === 'file' && (
          <FileInput onBase64={setFileB64} label={action.label} />
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !canSubmit}
          style={{
            ...s.submitBtn,
            background: action.gradient,
            opacity: (loading || !canSubmit) ? 0.5 : 1,
            cursor: (loading || !canSubmit) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <>
              <span style={s.spinner} />
              Running AI analysis...
            </>
          ) : action.combineType === 'meetings' ? 'Analyze Meeting'
            : action.combineType === 'notes'    ? 'Format & Summarize'
            : 'Run AI Analysis'}
        </button>

        {/* Results */}
        {(result || error) && (
          <div style={s.results}>
            <div style={s.resultsHeader}>
              <span style={s.resultsLabel}>{error ? 'Error' : 'AI Response'}</span>
              {result && (
                <button onClick={handleCopy} style={s.copyBtn}>
                  {copied ? '✅ Copied' : action?.id === 'flowchart' ? '🖼️ Copy Image' : '📋 Copy'}
                </button>
              )}
            </div>

            {error && (
              <div style={s.errorBox}>⚠️ {error}</div>
            )}

            {result?.combined && result.combineType === 'meetings' && (
              <CombinedMeetingResult momData={result.momData} meetingData={result.meetingData} />
            )}
            {result?.combined && result.combineType === 'notes' && (
              <CombinedNoteResult noteData={result.noteData} summarizeData={result.summarizeData} />
            )}
            {result && !result.combined && renderSingleResult(action, result.data, flowchartRef)}
          </div>
        )}
      </div>
    </>
  );
}

function renderSingleResult(action, data, flowchartRef) {
  if (!action || !data) return null;
  switch (action.id) {
    case 'note':       return <NoteResult data={data} />;
    case 'summarize':  return <SummarizeResult data={data} />;
    case 'mail':       return <MailResult data={data} />;
    case 'image':      return <ImageResult data={data} />;
    case 'dictionary': return <DictionaryResult data={data} />;
    case 'flowchart':  return <FlowchartResult ref={flowchartRef} data={data} />;
    default:           return null;
  }
}

function buildCopyText(action, data) {
  if (!action || !data) return '';
  switch (action.id) {
    case 'note':
      return `${data.title}\n\n${data.formatted_text}\n\nKey Points:\n${data.bullets?.map(b => '• ' + b).join('\n') || ''}`;
    case 'summarize':
      return `Topic: ${data.topic}\n\n${data.summary}\n\nKey Points:\n${data.key_points?.map(p => '• ' + p).join('\n') || ''}`;
    case 'mail':
      return `Subject: ${data.subject}\n\n${data.greeting}\n\n${data.body}\n\n${data.sign_off}`;
    case 'dictionary':
      return `${data.word} (${data.part_of_speech})\n\n${data.definition}\n\nExample: "${data.example}"\n\nSynonyms: ${data.synonyms?.join(', ')}`;
    case 'flowchart':
      return data.mermaid_code;
    default:
      return JSON.stringify(data, null, 2);
  }
}

const s = {
  panel: {
    padding: '56px 64px 80px',
    animation: 'fadeUp 0.3s ease',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    fontSize: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#dce8ff',
    letterSpacing: '-0.4px',
  },
  desc: {
    fontSize: 15,
    color: '#6b8fc4',
    marginTop: 4,
  },
  fireflyBadge: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 12px',
    background: 'rgba(26,95,212,0.18)',
    color: '#7ab0f0',
    borderRadius: 99,
    letterSpacing: '0.3px',
    flexShrink: 0,
  },

  divider: {
    height: 1,
    background: 'rgba(26,95,212,0.15)',
    marginBottom: 28,
  },

  fireflyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 18px',
    marginBottom: 20,
    background: 'rgba(26,95,212,0.12)',
    border: '1px solid rgba(26,95,212,0.28)',
    borderRadius: 12,
    color: '#7ab0f0',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s',
  },

  submitBtn: {
    width: '100%',
    padding: '18px',
    borderRadius: 14,
    border: 'none',
    color: 'white',
    fontSize: 17,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'Inter, sans-serif',
    transition: 'opacity 0.2s',
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },

  results: {
    marginTop: 32,
    animation: 'fadeUp 0.4s ease',
  },
  resultsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#3a5580',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: 'rgba(26,95,212,0.1)',
    border: '1px solid rgba(26,95,212,0.22)',
    borderRadius: 8,
    color: '#7ab0f0',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 12,
    padding: 16,
    color: '#fca5a5',
    fontSize: 13,
  },

  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '100vh',
    textAlign: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#e8eaf2',
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: '-0.5px',
  },
  emptySub: {
    fontSize: 14,
    color: '#454e68',
    marginBottom: 28,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  chip: {
    fontSize: 12,
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 99,
    color: '#8b92a8',
  },
};
