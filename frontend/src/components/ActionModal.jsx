import { useState, useEffect } from 'react';
import FirefliesTranscriptPicker from './FirefliesTranscriptPicker';

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

export default function ActionModal({ action, onClose }) {
  const [value, setValue]               = useState('');
  const [fileB64, setFileB64]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);   // { momData, meetingData } | single data obj
  const [error, setError]               = useState(null);
  const [copied, setCopied]             = useState(false);
  const [showFireflies, setShowFireflies] = useState(false);

  const open = !!action;

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
          // Call note + summarize in parallel
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
          // meetings: call meeting + mom in parallel
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
        // Single action
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

  function handleFirefliesSelect(transcript, title) {
    setValue(transcript);
    setShowFireflies(false);
  }

  function handleCopy() {
    if (!result) return;
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

  return (
    <>
      {/* Fireflies Picker (nested on top) */}
      <FirefliesTranscriptPicker
        open={showFireflies}
        onClose={() => setShowFireflies(false)}
        onSelect={handleFirefliesSelect}
      />

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Bottom Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101,
          background: '#0d0f1a',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          maxHeight: '92vh', overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 99, margin: '14px auto 0' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 32px 52px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <button
              onClick={onClose}
              style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#8b92a8', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ←
            </button>
            {action && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, fontSize: 22, background: action.gradient + '28', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {action.icon}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#e8eaf2' }}>{action.title}</div>
                  <div style={{ fontSize: 12, color: '#8b92a8' }}>{action.desc}</div>
                </div>
              </div>
            )}
          </div>

          {/* Fireflies import button (for meeting hub) */}
          {action?.fireflies && (
            <button
              onClick={() => setShowFireflies(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 14px', marginBottom: 12,
                background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 10, color: '#a78bfa', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              <span>🎙️</span>
              Import from Fireflies
            </button>
          )}

          {/* Input */}
          {action?.inputType === 'textarea' && (
            <TextAreaInput value={value} onChange={setValue} label={action.label} placeholder={action.placeholder} />
          )}
          {action?.inputType === 'text' && (
            <TextInput value={value} onChange={setValue} label={action.label} placeholder={action.placeholder} onEnter={handleSubmit} />
          )}
          {action?.inputType === 'file' && (
            <FileInput onBase64={setFileB64} label={action.label} />
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 'none',
              background: action ? action.gradient : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white', fontSize: 15, fontWeight: 600,
              opacity: (loading || !canSubmit) ? 0.5 : 1,
              cursor: (loading || !canSubmit) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Running AI analysis...
              </>
            ) : action?.combineType === 'meetings' ? 'Analyze Meeting'
              : action?.combineType === 'notes'    ? 'Format & Summarize'
              : 'Run AI Analysis'}
          </button>

          {/* Results */}
          {(result || error) && (
            <div style={{ marginTop: 28, animation: 'fadeUp 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#454e68', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {error ? 'Error' : 'AI Response'}
                </div>
                {result && (
                  <button
                    onClick={handleCopy}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#8b92a8', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
                  >
                    {copied ? '✅ Copied' : '📋 Copy'}
                  </button>
                )}
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: 16, color: '#fca5a5', fontSize: 13, display: 'flex', gap: 10 }}>
                  ⚠️ {error}
                </div>
              )}

              {result?.combined && result.combineType === 'meetings' && (
                <CombinedMeetingResult momData={result.momData} meetingData={result.meetingData} />
              )}

              {result?.combined && result.combineType === 'notes' && (
                <CombinedNoteResult noteData={result.noteData} summarizeData={result.summarizeData} />
              )}

              {result && !result.combined && renderSingleResult(action, result.data)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function renderSingleResult(action, data) {
  if (!action || !data) return null;
  switch (action.id) {
    case 'note':       return <NoteResult data={data} />;
    case 'summarize':  return <SummarizeResult data={data} />;
    case 'mail':       return <MailResult data={data} />;
    case 'image':      return <ImageResult data={data} />;
    case 'dictionary': return <DictionaryResult data={data} />;
    case 'flowchart':  return <FlowchartResult data={data} />;
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
