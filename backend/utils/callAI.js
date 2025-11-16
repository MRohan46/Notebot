export const callAI = async (text, mode) => {
  try {
    const prompt = `
You are a helpful assistant that outputs JSON only.
- If mode is "summary":
  - The summary must be detailed and proportional to the length of the input text.
  - For short texts (e.g., a paragraph), provide **6 to 8** points.
  - For medium texts (e.g., one page), provide **10 to 15** points.
  - For long texts (e.g., multiple pages), provide **18 to 25** points.
  - Ensure the key information is retained and summarized accurately.
  - Return {"type":"summary","content":{"summary":["..."],"keywords":["..."]}}
- If mode is "quiz": return {"type":"quiz","content":[{"question":"...","answer":"..."}]}
Make summary concise (make bullet points according to the length of Text, Min Points = 5-6, Max Points = 16). Return only JSON.

Mode: ${mode}
Text: ${text}
`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCBZkdhuerhNJAk_CvWm5fKWOeDG7t3b0M',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();

    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    rawText = rawText.replace(/```json/i, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(rawText);
    } catch {
      return { type: mode, content: { raw: rawText } };
    }

  } catch (err) {
    console.error('Google GenAI call failed:', err.message || err);
    return { type: mode, content: { raw: 'Error calling AI' } };
  }
};
