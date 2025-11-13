import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { text, language } = await req.json();
  
  // Validate input
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
  }

  // Determine the voice based on language
  let voice = 'Fritz-PlayAI';
  if (language.startsWith('bn')) {
    // Try using an Arabic voice for Bangla as a temporary solution
    voice = 'Amira-PlayAI';
  }

  // Set the model based on language
  const model = 'playai-tts';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: voice,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq TTS API error: ${response.status}`, errorText);
      throw new Error(`Groq TTS API error: ${response.status} ${errorText}`);
    }

    // Return the audio stream directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
