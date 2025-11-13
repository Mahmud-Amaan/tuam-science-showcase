import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("audio") as File | null;
    const language = (form.get("language") as string | null) || undefined;

    if (!file) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const fd = new FormData();
    fd.set("file", file);
    fd.set("model", "whisper-large-v3-turbo");
    if (language) fd.set("language", language);
    fd.set("response_format", "json");
    fd.set("temperature", "0");

    const resp = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: fd,
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: "Groq STT error", details: errText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json({ text: data.text, raw: data });
  } catch (err) {
    console.error("Transcription route error:", err);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
