import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { ResultCard, Section } from './shared';

mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });

const FlowchartResult = forwardRef(function FlowchartResult({ data }, ref) {
  const svgRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !data.mermaid_code) return;
    setRenderError(false);
    const id = 'mermaid-' + Date.now();
    mermaid.render(id, data.mermaid_code)
      .then(({ svg }) => {
        if (svgRef.current) svgRef.current.innerHTML = svg;
      })
      .catch(() => setRenderError(true));
  }, [data.mermaid_code]);

  useImperativeHandle(ref, () => ({
    copyImage: () => {
      const svgEl = svgRef.current?.querySelector('svg');
      if (!svgEl) return;

      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          } catch {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'flowchart.png';
            a.click();
          }
        }, 'image/png');
      };
      img.src = url;
    }
  }));

  function copyCode() {
    navigator.clipboard.writeText(data.mermaid_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  return (
    <ResultCard>
      <Section title={`Diagram · ${data.node_count || '?'} nodes`}>
        {renderError ? (
          <div style={{ color: '#8b92a8', fontSize: 13 }}>Could not render diagram. See Mermaid code below.</div>
        ) : (
          <div ref={svgRef} style={{ background: 'white', borderRadius: 10, padding: '20px 16px', overflowX: 'auto' }} />
        )}
      </Section>

      <Section title="Mermaid Code">
        <div style={{ position: 'relative' }}>
          <pre style={{ background: '#04091c', border: '1px solid rgba(26,95,212,0.18)', borderRadius: 10, padding: 16, fontSize: 12, color: '#7ab0f0', overflowX: 'auto', lineHeight: 1.6 }}>
            {data.mermaid_code}
          </pre>
          <button
            onClick={copyCode}
            style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(26,95,212,0.12)', border: '1px solid rgba(26,95,212,0.22)', borderRadius: 6, color: '#7ab0f0', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}
          >
            {copiedCode ? '✅ Copied' : '📋 Copy'}
          </button>
        </div>
      </Section>
    </ResultCard>
  );
});

export default FlowchartResult;
