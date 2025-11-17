export const callAI = async (text, mode) => {
  try {
const prompt = ` 
You are a helpful assistant that outputs JSON only.

- If mode is "summary":
  - The summary must be detailed and proportional to the input length.
  - For short texts (e.g., a paragraph), provide **6 to 8** points.
  - For medium texts (e.g., one page), provide **10 to 15** points.
  - For long texts (e.g., multiple pages), provide **18 to 25** points.
  - Keep summary concise but clear. Minimum 5–6 points, maximum 16–25 depending on text size.
  - Include:
      - "summary": bullet points
      - "keywords": important terms
      - "links": a list containing:
          - Relevant YouTube videos for the lesson
          - Links to detailed written lessons/resources
  - Return only JSON in this exact structure:
    {
      "type": "summary",
      "content": {
        "summary": ["..."],
        "keywords": ["..."],
        "links": ["..."]
      }
    }

- If mode is "quiz":
  - Return only:
    {
      "type": "quiz",
      "content": [
        {"question": "...", "answer": "..."}
      ]
    }

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
