// Prompt API utility
export async function getPromptResponse(prompt: string): Promise<string> {
	console.log('[PromptAPI] Sending prompt:', prompt);
	
	try {
		const res = await fetch('/api/prompt', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt }),
		});
		
		if (!res.ok) {
			const error = await res.text();
			console.error('[PromptAPI] API error:', res.status, error);
			throw new Error(`API returned ${res.status}: ${error}`);
		}
		
		const data = await res.json();
		console.log('[PromptAPI] Response received:', data.result?.substring(0, 100));
		return data.result || 'No response from AI';
	} catch (error) {
		console.error('[PromptAPI] Fetch error:', error);
		throw error;
	}
}
