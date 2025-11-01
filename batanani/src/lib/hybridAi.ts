// Central hybrid AI orchestrator
import { savePrompt, saveResult } from './firebase';
import { getPromptResponse } from './promptApi';
import { translateText } from './translatorApi';
import { summarizeText } from './summarizerApi';

export async function handleHybridAiFlow(
	userId: string,
	prompt: string,
	targetLang?: string
) {
	console.log('[HybridAI] Starting flow for prompt:', prompt);

	try {
		// Save prompt to Firebase (non-blocking)
		savePrompt(userId, prompt).catch((e) =>
			console.warn('[HybridAI] Failed to save prompt:', e)
		);

		// Get AI response - THIS IS THE CRITICAL PART
		const aiResponse = await getPromptResponse(prompt);
		console.log(
			'[HybridAI] AI response received:',
			aiResponse?.substring(0, 100)
		);

		// Ensure aiResponse is a string and provide a safe fallback
		const aiResponseStr =
			typeof aiResponse === 'string' && aiResponse.trim()
				? aiResponse
				: String(aiResponse ?? 'No response from AI');

		// Translation is optional - don't fail if it doesn't work
		let translated = aiResponseStr;
		if (targetLang && targetLang !== 'en') {
			try {
				console.log('[HybridAI] Translating to:', targetLang);
				translated = await translateText(aiResponseStr, targetLang);
				console.log('[HybridAI] Translation complete');
			} catch (e) {
				console.warn('[HybridAI] Translation failed, using original:', e);
				translated = aiResponseStr;
			}
		}

		// Summary is optional - don't fail if it doesn't work
		let summary = translated;
		try {
			summary = await summarizeText(translated);
			console.log('[HybridAI] Summary created');
		} catch (e) {
			console.warn('[HybridAI] Summarization failed, using full text:', e);
			summary = translated;
		}

		// Save result to Firebase (non-blocking)
		saveResult(userId, {
			prompt,
			aiResponse: aiResponseStr,
			translated,
			summary,
		}).catch((e) => console.warn('[HybridAI] Failed to save result:', e));

		console.log('[HybridAI] ✅ Flow complete, returning:', {
			aiResponse: aiResponseStr.substring(0, 50) + '...',
			translated: translated.substring(0, 50) + '...',
			summary: summary.substring(0, 50) + '...',
		});

		return { aiResponse: aiResponseStr, translated, summary };
	} catch (error) {
		console.error('[HybridAI] ❌ Critical error in flow:', error);
		// Return a fallback response instead of throwing
		return {
			aiResponse: 'Sorry, I encountered an error. Please try again.',
			translated: 'Sorry, I encountered an error. Please try again.',
			summary: 'Sorry, I encountered an error. Please try again.',
		};
	}
}
