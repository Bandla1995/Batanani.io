import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/geminiApi';

type ConversationRequest = {
	topic?: string;
	speakers?: string[];
	turns?: number;
	format?: 'json' | 'labelled';
};

export async function POST(request: NextRequest) {
	try {
		// Handle empty or malformed request body
		let body: ConversationRequest = {};
		
		try {
			const text = await request.text();
			if (text && text.trim()) {
				body = JSON.parse(text) as ConversationRequest;
			}
		} catch (parseError) {
			console.warn('Failed to parse request body, using defaults:', parseError);
			// Continue with empty body object (will use defaults)
		}

		const topic = body.topic ?? 'haircut techniques for fine, curly hair';
		const speakers =
			Array.isArray(body.speakers) && body.speakers.length > 0
				? body.speakers
				: ['Alex', 'Priya'];
		const turns =
			typeof body.turns === 'number' && body.turns > 0
				? Math.min(12, Math.max(2, body.turns))
				: 6;
		const format = body.format ?? 'json';

		const systemInstruction = `You are Bata AI, a friendly and concise hairdresser assistant. Keep replies short (1-2 sentences), use plain language suitable for audio playback.`;

		let prompt = `${systemInstruction}\n\nCreate a ${turns}-turn conversation between these speakers: ${speakers.join(
			', '
		)} about ${topic}.`;

		if (format === 'json') {
			prompt += ` Return the conversation as a JSON array of objects with keys \"speaker\" and \"text\". Example: [{\"speaker\":\"Alex\",\"text\":\"...\"}, ...]. Only output the JSON array and no extra explanation.`;
		} else {
			prompt += ` Label each line with the speaker name like \"Alex: ...\". Keep each line short and easy to read.`;
		}

		const result = await getGeminiResponse(prompt);

		// Parse into conversation array with several fallbacks
		let conversation: Array<{ speaker: string; text: string }> = [];

		const tryParseJson = (
			text: string
		): Array<{ speaker: string; text: string }> | null => {
			try {
				const parsed = JSON.parse(text);
				if (Array.isArray(parsed))
					return parsed as Array<{ speaker: string; text: string }>;
			} catch {
				return null;
			}
			return null;
		};

		if (format === 'json') {
			// First try direct parse
			conversation = tryParseJson(result) ?? [];

			// If parse failed, try extracting a JSON substring
			if (!conversation.length) {
				const jsonMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/m);
				if (jsonMatch) {
					conversation = tryParseJson(jsonMatch[0]) ?? [];
				}
			}

			// Last-resort: parse labelled lines
			if (!conversation.length) {
				conversation = result
					.split(/\r?\n/)
					.map((line) => {
						const idx = line.indexOf(':');
						if (idx === -1) return null;
						const speaker = line.slice(0, idx).trim();
						const text = line.slice(idx + 1).trim();
						if (!text) return null;
						return { speaker, text };
					})
					.filter(Boolean) as Array<{ speaker: string; text: string }>;
			}
		} else {
			// labelled format: split lines and map
			conversation = result
				.split(/\r?\n/)
				.map((line) => {
					const idx = line.indexOf(':');
					if (idx === -1) return null;
					const speaker = line.slice(0, idx).trim();
					const text = line.slice(idx + 1).trim();
					if (!text) return null;
					return { speaker, text };
				})
				.filter(Boolean) as Array<{ speaker: string; text: string }>;
		}

		return NextResponse.json({ conversation, raw: result });
	} catch (error) {
		console.error('Conversation API error:', error);
		
		const errorMessage = error instanceof Error ? error.message : 'Internal server error';
		
		return NextResponse.json(
			{ 
				error: errorMessage,
				details: process.env.NODE_ENV === 'development' ? String(error) : undefined
			},
			{ status: 500 }
		);
	}
}
