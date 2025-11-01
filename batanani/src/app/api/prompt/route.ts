import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/geminiApi';

export async function POST(request: NextRequest) {
	try {
		const { prompt } = await request.json();

		if (!prompt) {
			return NextResponse.json(
				{ error: 'Prompt is required' },
				{ status: 400 }
			);
		}

		// Prepend a short, voice-friendly system instruction to encourage concise replies
		const systemInstruction = `You are Bata AI, a friendly and concise hairdresser assistant. Keep replies short (1-2 sentences), use plain language suitable for audio playback, and ask one clarifying question only if necessary.`;
		const combinedPrompt = `${systemInstruction}\n\nUser: ${prompt}`;

		const result = await getGeminiResponse(combinedPrompt);

		return NextResponse.json({ result });
	} catch (error) {
		console.error('Prompt API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
