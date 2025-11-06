import { NextResponse } from "next/server";

type Intent = { type: "navigate" | "answer"; target?: string };

async function callGroq(prompt: string, apiKey: string) {
  try {
    // dynamic import so local dev without groq-sdk works if not installed
    const Groq = (await import("groq-sdk")).default;
    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful bilingual (Bangla/English) science teacher for Bangladeshi students. " +
            "Answer in the language specified by the user (do not mix). If the user asks to navigate to a page, reply with JSON-like intent info. Keep answers short and clear.",
        },
        { role: "user", content: prompt },
      ],  
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return text;
  } catch (e) {
    console.error("Groq call failed", e);
    throw e;
  }
}

// small rule-based parser to detect navigation intent from text
function detectNavigationIntent(textLower: string, lang: "en" | "bn"): Intent | null {
  // English keywords
  const mappingEn: Record<string, string> = {
    physics: "/physics",
    math: "/math",
    chemistry: "/chemistry",
    biology: "/biology",
    ict: "/ict",
    "information technology": "/ict",
  };
  // Bangla keywords
  const mappingBn: Record<string, string> = {
    "ফিজিক": "/physics",
    "ফিজিক্স": "/physics",
    "গণিত": "/math",
    "রসায়ন": "/chemistry",
    "রাসায়ন": "/chemistry",
    "জীববিজ্ঞান": "/biology",
    "আইসিটি": "/ict",
    "তথ্য প্রযুক্তি": "/ict",
  };

  const map = lang === "en" ? mappingEn : mappingBn;
  for (const k of Object.keys(map)) {
    if (textLower.includes(k)) return { type: "navigate", target: map[k] };
  }
  // direct commands
  if (lang === "en" && (textLower.includes("go to") || textLower.includes("open") || textLower.includes("take me to"))) {
    for (const k of Object.keys(mappingEn)) {
      if (textLower.includes(k)) return { type: "navigate", target: mappingEn[k] };
    }
  }
  if (lang === "bn" && (textLower.includes("যাও") || textLower.includes("খুল") || textLower.includes("অনুগ্রহ করে"))) {
    for (const k of Object.keys(mappingBn)) {
      if (textLower.includes(k)) return { type: "navigate", target: mappingBn[k] };
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = (body.message ?? "").toString();
    const language: "en" | "bn" = body.language === "bn" ? "bn" : "en";

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ reply: language === "bn" ? "কোনও প্রশ্ন পাওয়া যায়নি।" : "No question received.", intent: { type: "answer" as const } });
    }

    const messageLower = message.toLowerCase();

    // Quick local intent detection first (cheap & fast)
    const quickIntent = detectNavigationIntent(messageLower, language);
    if (quickIntent) {
      const reply = language === "bn" ? "আপনাকে সেই পেজে নিয়ে যাচ্ছি…" : "Redirecting you to that page…";
      return NextResponse.json({ reply, intent: quickIntent });
    }

    // If GROQ key is present, try calling it for a better answer
    const key = process.env.GROQ_API_KEY;
    if (key) {
      // Compose a carefully constrained prompt so the API returns plain answer (no extra JSON)
      const prompt = `Language:${language}\nUser: ${message}\n\nRespond in ${language === "bn" ? "Bangla (বাংলা)" : "English"} only. If the user asks to navigate, only answer in one sentence and include the word "NAVIGATE_TO:<target>" where <target> is one of /physics /math /chemistry /biology /ict. Otherwise answer normally in a short, clear way suitable for class 9 students.`;

      try {
        const raw = await callGroq(prompt, key);
        // try to parse special NAVIGATE_TO token inside the raw reply
        const navMatch = raw.match(/NAVIGATE_TO: *(\/\w+)/i);
        if (navMatch) {
          const target = navMatch[1];
          const reply = raw.replace(/NAVIGATE_TO: *\/\w+/i, "").trim();
          return NextResponse.json({ reply: reply || (language === "bn" ? "ঠিক আছে, নিচ্ছি…" : "Okay, taking you there…"), intent: { type: "navigate" as const, target } });
        }
        // otherwise normal answer
        return NextResponse.json({ reply: raw, intent: { type: "answer" as const } });
      } catch (e) {
        // fall through to local fallback
        console.warn("Groq failed, falling back", e);
      }
    }

    // Fallback: rule-based answer in selected language
    const fallbackAnswersEn: Record<string, string> = {
      motion: "Motion is the change of position of an object with time. You can use the physics simulator to visualize it.",
      force: "A force is a push or pull on an object. It can change the object's motion.",
      acceleration: "Acceleration is the rate of change of velocity with time.",
    };
    const fallbackAnswersBn: Record<string, string> = {
      motion: "গতি মানে হলো কোনো বস্তুর অবস্থান সময়ের সঙ্গে বদলানো। Physics সিমুলেশনে এটি দেখুন।",
      force: "বল হলো এমন একটি প্রভাব যা বস্তুর গতি পরিবর্তন করে।",
      acceleration: "ত্বরণ হলো বেগের পরিবর্তনের হার।",
    };

    for (const keyWord of Object.keys(fallbackAnswersEn)) {
      if (messageLower.includes(keyWord)) {
        return NextResponse.json({
          reply: language === "bn" ? fallbackAnswersBn[keyWord] : fallbackAnswersEn[keyWord],
          intent: { type: "answer" as const },
        });
      }
    }

    // default fallback
    return NextResponse.json({
      reply: language === "bn" ? "দুঃখিত, আমি সেটা বুঝতে পারিনি — একটু সহজ করেই বলুন।" : "Sorry, I couldn't understand that — please try asking differently.",
      intent: { type: "answer" as const },
    });
  } catch (err) {
    console.error("educator route error", err);
    return NextResponse.json({ reply: "Server error", intent: { type: "answer" as const } }, { status: 500 });
  }
}
