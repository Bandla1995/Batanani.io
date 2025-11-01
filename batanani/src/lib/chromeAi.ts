// Chrome built-in AI Prompt API helper (Experimental, Chrome Canary)
// See: https://developer.chrome.com/docs/ai/built-in

type PromptMessage = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

declare global {
	interface Window {
		ai?: {
			languageModel?: {
				availability: () => Promise<'readily' | 'after-download' | 'no'>;
				create: (options?: {
					temperature?: number;
					topK?: number;
					signal?: AbortSignal;
					initialPrompts?: PromptMessage[];
					expectedInputs?: Array<{ type: string; languages: string[] }>;
					expectedOutputs?: Array<{ type: string; languages: string[] }>;
					monitor?: (m: unknown) => void;
				}) => Promise<AILanguageModel>;
				params?: () => Promise<{
					defaultTemperature: number;
					defaultTopK: number;
				}>;
			};
		};
	}

	interface AILanguageModel {
		prompt: (input: string | PromptMessage[]) => Promise<string>;
		destroy: () => void;
	}
}

let session: AILanguageModel | null = null;

export async function checkChromeAiAvailability(): Promise<boolean> {
	if (typeof window === 'undefined') {
		console.log('[Chrome AI] Window is undefined (SSR)');
		return false;
	}
	if (!window.ai?.languageModel) {
		console.log('[Chrome AI] window.ai.languageModel not available');
		console.log('[Chrome AI] Are you using Chrome Canary with flags enabled?');
		return false;
	}

	try {
		const availability = await window.ai.languageModel.availability();
		console.log('[Chrome AI] Availability status:', availability);
		return availability === 'readily' || availability === 'after-download';
	} catch (error) {
		console.error('[Chrome AI] Availability check failed:', error);
		return false;
	}
}

export async function createChromeAiSession(): Promise<AILanguageModel | null> {
	if (session) {
		console.log('[Chrome AI] Using existing session');
		return session;
	}
	if (!window.ai?.languageModel) {
		console.log('[Chrome AI] Cannot create session - API not available');
		return null;
	}

	try {
		console.log('[Chrome AI] Creating new session...');
		session = await window.ai.languageModel.create({
			expectedInputs: [{ type: 'text', languages: ['en', 'nr', 'tn'] }],
			expectedOutputs: [{ type: 'text', languages: ['nr', 'tn', 'en'] }],
			initialPrompts: [
				{
					role: 'system',
					content:
						'You are Bata AI, a helpful and friendly hairstylist assistant. Keep replies short (1-2 sentences), use plain language suitable for conversation.',
				},
				{
					role: 'user',
					content: 'What hairstyle would you recommend for thin curly hair?',
				},
				{
					role: 'assistant',
					content:
						'Try layered cuts to add volume and bounce. Use lightweight mousse to define curls without weighing them down.',
				},
			],
		});
		console.log('[Chrome AI] Session created successfully');
		return session;
	} catch (err) {
		console.error('[Chrome AI] Session creation failed:', err);
		return null;
	}
}

export async function promptChromeAi(
	userMessage: string,
	conversationHistory?: PromptMessage[]
): Promise<string> {
	console.log('[Chrome AI] Prompting with message:', userMessage);
	const sess = await createChromeAiSession();
	if (!sess) {
		console.error('[Chrome AI] Session is null - cannot prompt');
		throw new Error('Chrome AI not available');
	}

	try {
		let result: string;
		if (conversationHistory && conversationHistory.length > 0) {
			console.log(
				'[Chrome AI] Using conversation history:',
				conversationHistory.length,
				'messages'
			);
			// Use conversation context
			result = await sess.prompt([
				...conversationHistory,
				{ role: 'user', content: userMessage },
			]);
		} else {
			console.log('[Chrome AI] Using simple prompt');
			// Simple prompt
			result = await sess.prompt(userMessage);
		}
		console.log(
			'[Chrome AI] Response received:',
			result?.substring(0, 100) + '...'
		);
		return result;
	} catch (err) {
		console.error('[Chrome AI] Prompt error:', err);
		throw err;
	}
}

export function destroyChromeAiSession() {
	if (session) {
		try {
			session.destroy();
		} catch {
			// ignore
		}
		session = null;
	}
}
