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
	await savePrompt(userId, prompt);
	const aiResponse = await getPromptResponse(prompt);

	let translated = aiResponse;
	if (targetLang) {
		translated = await translateText(aiResponse, targetLang);
	}

	const summary = await summarizeText(translated);

	await saveResult(userId, { prompt, aiResponse, translated, summary });
	return { aiResponse, translated, summary };
}
