import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/geminiApi';

// Language name mapping for Gemini prompts
const LANGUAGE_NAMES: Record<string, string> = {
	en: 'English',
	nr: 'Ndebele',
	tn: 'Setswana',
	es: 'Spanish',
	zu: 'Zulu',
	xh: 'Xhosa',
	af: 'Afrikaans',
	fr: 'French',
	de: 'German',
	pt: 'Portuguese',
};

export async function POST(request: NextRequest) {
	try {
		const { text, targetLang, sourceLang } = await request.json();

		if (!text || !targetLang) {
			return NextResponse.json(
				{ error: 'Text and targetLang are required' },
				{ status: 400 }
			);
		}

		const targetLanguageName = LANGUAGE_NAMES[targetLang] || targetLang;
		const sourceLanguageName = sourceLang
			? LANGUAGE_NAMES[sourceLang] || sourceLang
			: 'auto-detected language';

		// Build translation prompt
		const prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Only return the translated text, no explanations or additional text.\n\nText to translate: "${text}"`;

		const translatedText = await getGeminiResponse(prompt);

		return NextResponse.json({
			translatedText: translatedText.trim(),
			sourceLang: sourceLang || 'auto',
			targetLang,
		});
	} catch (error) {
		console.error('Translate API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
