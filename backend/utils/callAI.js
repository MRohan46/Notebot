export const callAI = async (text, mode) => {
  try {
const prompt = ` 
MODE: "summary"
If Mode is "summary", analyze the 'Text' and generate a summary, keywords, and links.

Summary Length: The summary must be detailed and proportional to the input text length, containing between 6 and 15 highly relevant bullet points.

"links": Include a list of relevant external links (YouTube videos or written resources). If no specific links are relevant, provide an empty list: [].

JSON Structure for "summary" Mode:

{
  "type": "summary",
  "content": {
    "summary": ["...", "..."],
    "keywords": ["...", "..."],
    "links": ["...", "..."]
  }
}
  
MODE: "quiz"
If Mode is "quiz", generate a list of question-and-answer pairs based on the 'Text'.

JSON Structure for "quiz" Mode:

JSON

{
  "type": "quiz",
  "content": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
}
INPUT
Mode: ${mode} Text: ${text}
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
