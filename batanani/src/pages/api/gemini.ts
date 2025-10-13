import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Gemini Pro endpoint (Google Generative Language API)
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await response.json();
  // The generated text is in data.candidates[0].content.parts[0].text
  res.status(200).json({ result: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '' });
}
