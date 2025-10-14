// Utility to call Gemini API route
export async function getGeminiResponse(prompt: string): Promise<string> {
	const apiKey = process.env.GEMINI_API_KEY!;
	const res = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
			}),
		}
	);
	const data = await res.json();
	return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
}
