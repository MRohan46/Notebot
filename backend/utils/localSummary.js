// --- Local fallback: simple heuristic summarizer + quiz generator
export const localSummary = (text) => {
  // Split into sentences, pick up to 5 meaningful ones
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 10);

  const summary = sentences.slice(0, 5).map(s => s.trim());
  // keywords: naive: pick capitalized words and frequent words > 5 chars
  const words = text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);

  const freq = {};
  words.forEach(w => {
    const lw = w.toLowerCase();
    if (lw.length > 4) freq[lw] = (freq[lw] || 0) + 1;
  });

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  return { summary, keywords };
};
