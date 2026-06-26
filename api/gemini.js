module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { promptText, entryText } = req.body;
  if (!promptText || !entryText) {
    return res.status(400).json({ error: 'Missing promptText or entryText' });
  }

  const message = `You are a Socratic writing coach for a 9th grade English literature class. \
A student has responded to a writing prompt. Generate exactly 3 short, thought-provoking \
follow-up questions that push the student to think more deeply. Rules: reference something \
specific from what the student wrote; no yes/no questions; push toward evidence, nuance, \
or personal connection; approachable for a 9th grader. Return only the 3 questions numbered 1-3, nothing else.

Writing prompt: "${promptText}"

Student's response:
"${entryText.slice(0, 1500)}"`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
      })
    }
  );

  if (!response.ok) {
    return res.status(502).json({ error: 'Gemini API error' });
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return res.json({ questions: text });
}
