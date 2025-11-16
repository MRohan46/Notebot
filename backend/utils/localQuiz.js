export const localQuiz = (text) => {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 10);

  const questions = [];

  // Make up to 3 Qs by turning sentences into question-answer pairs
  for (let i = 0; i < Math.min(3, sentences.length); i++) {
    const s = sentences[i].trim();
    // naive Q: "What is X?" if sentence starts with "X is/are..."
    const m = s.match(/^(.+?)\s+(is|are|was|contain|contains|produce|produces|occurs)/i);
    if (m) {
      const topic = m[1];
      const question = `What does the sentence say about "${topic}"?`;
      questions.push({ question, answer: s });
    } else {
      // fallback: generic comprehension question
      questions.push({
        question: `Summarize the following idea: "${s.split(" ").slice(0,8).join(" ")}..."`,
        answer: s
      });
    }
  }

  // If not enough sentences, add sample question(s)
  while (questions.length < 3) {
    questions.push({
      question: "Give a key point from the text.",
      answer: sentences[0] || "No content provided."
    });
  }

  return questions;
};
