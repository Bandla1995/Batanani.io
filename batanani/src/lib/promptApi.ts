// Prompt API utility (example: OpenAI)
export async function getPromptResponse(prompt: string): Promise<string> {
	const res = await fetch('/api/prompt', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt }),
	});
	const data = await res.json();
	return data.result;
}
