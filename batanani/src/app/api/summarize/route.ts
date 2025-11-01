import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/geminiApi';

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text) {
			return NextResponse.json({ error: 'Text is required' }, { status: 400 });
		}

		const prompt = `Summarize the following text in a concise manner: "${text}"`;
		const summary = await getGeminiResponse(prompt);

		return NextResponse.json({ summary });
	} catch (error) {
		console.error('Summarize API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
