// Summarizer API utility
export async function summarizeText(text: string): Promise<string> {
	console.log('[Summarizer] Summarizing text...');

	try {
		const res = await fetch('/api/summarize', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text }),
		});

		if (!res.ok) {
			console.warn('[Summarizer] API failed, using original text');
			return text; // Return original if summary fails
		}

		const data = await res.json();
		console.log('[Summarizer] Summary created');
		return data.summary || text;
	} catch (error) {
		console.error('[Summarizer] Error:', error);
		return text; // Fallback to original text
	}
}
