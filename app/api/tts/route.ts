import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { text, language } = await req.json();
  
  // Validate input
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid text' }, { status: 400 });
  }

  const isBangla = language && language.startsWith('bn');

  try {
    if (isBangla) {
      // Use free Google Translate TTS API for Bangla
      // Google Translate TTS fails with a 400 if the query is over 200 characters
      let cleanText = text;
      if (cleanText.length > 200) {
        // Safe truncate to avoid breaking the 200 char limit
        cleanText = cleanText.substring(0, 197) + '...';
      }
      
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
      
      const response = await fetch(googleTtsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`Google TTS responded with status ${response.status}`);
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
    } else {
      // Use Deepgram for English
      const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
      if (!deepgramApiKey) {
        throw new Error('DEEPGRAM_API_KEY is not configured');
      }

      const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-zeus-en&encoding=mp3', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${deepgramApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Deepgram TTS error: ${response.status}`, errorText);
        throw new Error(`Deepgram TTS error: ${response.status} ${errorText}`);
      }

      return new Response(response.body, {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
    }
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
