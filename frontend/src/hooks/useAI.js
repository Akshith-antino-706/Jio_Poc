import { useState } from 'react';

const API = 'https://workflow.antino.ca/webhook/cxo/process';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);

  async function run(payload) {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || 'AI request failed');
      } else {
        setData(json);
      }
    } catch (e) {
      setError('Connection error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setData(null);
    setError(null);
  }

  return { loading, data, error, run, reset };
}
