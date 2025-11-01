// Chrome built-in Translator API helper (Experimental, Chrome Canary)
// See: https://developer.chrome.com/docs/ai/translator-api

declare global {
	interface Window {
		translation?: {
			canTranslate?: (options: {
				sourceLanguage: string;
				targetLanguage: string;
			}) => Promise<'readily' | 'after-download' | 'no'>;
			createTranslator?: (options: {
				sourceLanguage: string;
				targetLanguage: string;
				monitor?: (m: TranslatorMonitor) => void;
			}) => Promise<LanguageTranslator>;
		};
	}

	interface TranslatorMonitor {
		addEventListener: (
			event: 'downloadprogress',
			callback: (e: { loaded: number; total: number }) => void
		) => void;
	}

	interface LanguageTranslator {
		translate: (text: string) => Promise<string>;
		translateStreaming?: (
			text: string
		) => AsyncIterable<string>;
		destroy?: () => void;
	}
}

// Language mapping for common codes
const LANGUAGE_MAP: Record<string, string> = {
	en: 'en',
	nr: 'nr', // Ndebele
	tn: 'tn', // Setswana
	es: 'es', // Spanish (legacy support)
	zu: 'zu', // Zulu
	xh: 'xh', // Xhosa
	af: 'af', // Afrikaans
};

const translatorCache: Map<
	string,
	LanguageTranslator
> = new Map();

/**
 * Check if Chrome Translator API is available
 */
export async function checkTranslatorAvailability(): Promise<boolean> {
	if (typeof window === 'undefined') return false;
	if (!window.translation?.canTranslate) return false;

	try {
		// Test with common language pair
		const availability = await window.translation.canTranslate({
			sourceLanguage: 'en',
			targetLanguage: 'es',
		});
		return availability === 'readily' || availability === 'after-download';
	} catch {
		return false;
	}
}

/**
 * Check if specific language pair is available
 */
export async function canTranslate(
	sourceLanguage: string,
	targetLanguage: string
): Promise<'readily' | 'after-download' | 'no'> {
	if (!window.translation?.canTranslate) return 'no';

	try {
		const sourceLang = LANGUAGE_MAP[sourceLanguage] || sourceLanguage;
		const targetLang = LANGUAGE_MAP[targetLanguage] || targetLanguage;

		const availability = await window.translation.canTranslate({
			sourceLanguage: sourceLang,
			targetLanguage: targetLang,
		});
		return availability;
	} catch (err) {
		console.error('Error checking translation availability:', err);
		return 'no';
	}
}

/**
 * Create a translator instance
 */
export async function createTranslator(
	sourceLanguage: string,
	targetLanguage: string,
	onProgress?: (loaded: number) => void
): Promise<LanguageTranslator | null> {
	if (!window.translation?.createTranslator) return null;

	const sourceLang = LANGUAGE_MAP[sourceLanguage] || sourceLanguage;
	const targetLang = LANGUAGE_MAP[targetLanguage] || targetLanguage;

	// Check cache
	const cacheKey = `${sourceLang}-${targetLang}`;
	if (translatorCache.has(cacheKey)) {
		return translatorCache.get(cacheKey)!;
	}

	try {
		const translator = await window.translation.createTranslator({
			sourceLanguage: sourceLang,
			targetLanguage: targetLang,
			monitor: onProgress
				? (m) => {
						m.addEventListener('downloadprogress', (e) => {
							const percentage = (e.loaded / e.total) * 100;
							onProgress(percentage);
						});
				  }
				: undefined,
		});

		// Cache translator
		translatorCache.set(cacheKey, translator);
		return translator;
	} catch (err) {
		console.error('Error creating translator:', err);
		return null;
	}
}

/**
 * Translate text using Chrome built-in Translator API
 */
export async function translateWithChrome(
	text: string,
	sourceLanguage: string,
	targetLanguage: string,
	onProgress?: (loaded: number) => void
): Promise<string | null> {
	try {
		const translator = await createTranslator(
			sourceLanguage,
			targetLanguage,
			onProgress
		);
		if (!translator) return null;

		const translatedText = await translator.translate(text);
		return translatedText;
	} catch (err) {
		console.error('Translation error:', err);
		return null;
	}
}

/**
 * Translate text with streaming support (for long texts)
 */
export async function* translateStreaming(
	text: string,
	sourceLanguage: string,
	targetLanguage: string,
	onProgress?: (loaded: number) => void
): AsyncGenerator<string, void, unknown> {
	const translator = await createTranslator(
		sourceLanguage,
		targetLanguage,
		onProgress
	);

	if (!translator || !translator.translateStreaming) {
		// Fallback to non-streaming
		const result = await translator?.translate(text);
		if (result) yield result;
		return;
	}

	try {
		const stream = translator.translateStreaming(text);
		for await (const chunk of stream) {
			yield chunk;
		}
	} catch (err) {
		console.error('Streaming translation error:', err);
	}
}

/**
 * Translate text with automatic fallback to server API
 */
export async function translateText(
	text: string,
	targetLang: string,
	sourceLang: string = 'en',
	onProgress?: (loaded: number) => void
): Promise<string> {
	// Try Chrome built-in translator first
	if (await checkTranslatorAvailability()) {
		const availability = await canTranslate(sourceLang, targetLang);

		if (availability !== 'no') {
			const translated = await translateWithChrome(
				text,
				sourceLang,
				targetLang,
				onProgress
			);
			if (translated) return translated;
		}
	}

	// Fallback to server API
	try {
		const res = await fetch('/api/translate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				text,
				targetLang,
				sourceLang,
			}),
		});
		const data = await res.json();
		return data.translatedText || text;
	} catch (err) {
		console.error('Server translation fallback error:', err);
		return text; // Return original text if all fails
	}
}

/**
 * Destroy all cached translators
 */
export function destroyAllTranslators() {
	translatorCache.forEach((translator) => {
		try {
			translator.destroy?.();
		} catch {
			// ignore
		}
	});
	translatorCache.clear();
}

/**
 * Destroy specific translator
 */
export function destroyTranslator(
	sourceLanguage: string,
	targetLanguage: string
) {
	const sourceLang = LANGUAGE_MAP[sourceLanguage] || sourceLanguage;
	const targetLang = LANGUAGE_MAP[targetLanguage] || targetLanguage;
	const cacheKey = `${sourceLang}-${targetLang}`;

	const translator = translatorCache.get(cacheKey);
	if (translator) {
		try {
			translator.destroy?.();
		} catch {
			// ignore
		}
		translatorCache.delete(cacheKey);
	}
}

/**
 * Get supported language pairs (future enhancement)
 */
export async function getSupportedLanguages(): Promise<string[]> {
	// This would require API support for listing available languages
	// For now, return our mapped languages
	return Object.keys(LANGUAGE_MAP);
}

/**
 * Auto-detect source language (requires additional API, fallback to 'en')
 */
export function detectLanguage(text: string): string {
	// Simple heuristic - can be enhanced with language detection library
	// For now, default to English
	return 'en';
}
