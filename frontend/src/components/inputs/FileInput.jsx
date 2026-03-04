import { useState, useRef } from 'react';

export default function FileInput({ onBase64, label }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const b64 = e.target.result.split(',')[1];
      onBase64(b64);
      setPreview({ name: file.name, url: e.target.result });
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    setPreview(null);
    onBase64(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>

      {!preview ? (
        <div
          style={{ ...styles.dropZone, borderColor: dragging ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)', background: dragging ? 'rgba(99,102,241,0.05)' : '#12151f' }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
          <div style={{ fontSize: 14, color: '#8b92a8', marginBottom: 4 }}>Drop image here or click to upload</div>
          <div style={{ fontSize: 12, color: '#454e68' }}>Supports JPG, PNG, GIF, WebP</div>
        </div>
      ) : (
        <div style={styles.previewRow}>
          <img src={preview.url} alt="" style={styles.thumb} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: '#e8eaf2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview.name}</div>
            <div style={{ fontSize: 11, color: '#10b981', marginTop: 3 }}>✓ Ready to extract</div>
          </div>
          <button onClick={clear} style={styles.clearBtn}>✕</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  label: {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#454e68',
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8,
  },
  dropZone: {
    borderRadius: 12, border: '2px dashed',
    padding: '40px 20px', textAlign: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  previewRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: '#12151f', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: '12px 16px',
  },
  thumb: { width: 48, height: 48, borderRadius: 8, objectFit: 'cover' },
  clearBtn: {
    background: 'none', border: 'none', color: '#454e68',
    fontSize: 16, padding: 4, transition: 'color 0.15s',
  },
};
