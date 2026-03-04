const FIREFLIES_URL = 'https://api.fireflies.ai/graphql';
const FIREFLIES_KEY = '596ed294-816d-4121-9558-63384532fa9f';

async function gql(query, variables = {}) {
  const res = await fetch(FIREFLIES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIREFLIES_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export async function getTranscripts() {
  const data = await gql(`
    query {
      transcripts {
        id
        title
        date
        duration
        organizer_email
        participants
      }
    }
  `);
  return data.transcripts || [];
}

export async function getTranscript(id) {
  const data = await gql(
    `query Transcript($id: String!) {
      transcript(id: $id) {
        id
        title
        date
        duration
        participants
        sentences {
          speaker_name
          text
        }
        summary {
          overview
          action_items
          short_summary
          keywords
        }
      }
    }`,
    { id }
  );
  return data.transcript;
}

export function formatTranscript(sentences = []) {
  return sentences
    .filter(s => s.text?.trim())
    .map(s => `${s.speaker_name || 'Speaker'}: ${s.text.trim()}`)
    .join('\n');
}

export function formatDuration(seconds) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(typeof dateStr === 'number' ? dateStr : dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
