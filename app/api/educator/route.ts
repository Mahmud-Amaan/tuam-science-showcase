import { NextResponse } from "next/server";

type Intent = { type: "navigate" | "answer"; target?: string };

function detectNavigationIntent(message: string, language: "en" | "bn"): Intent | null {
  const messageLower = message.toLowerCase();
  
  // Navigation keywords
  const navPatterns = [
    { keywords: ["physics", "পদার্থবিজ্ঞান", "পদার্থ"], target: "/physics" },
    { keywords: ["math", "গণিত", "ম্যাথ"], target: "/math" },
    { keywords: ["chemistry", "রসায়ন", "কেমিস্ট্রি"], target: "/chemistry" },
    { keywords: ["biology", "জীববিজ্ঞান", "জীব"], target: "/biology" },
    { keywords: ["ict", "আইসিটি", "তথ্য"], target: "/ict" },
  ];

  // Check for navigation intent with "go to", "open", etc.
  const navCommands = ["go to", "open", "show", "খোলা", "যাও", "দেখাও"];
  const hasNavCommand = navCommands.some(cmd => messageLower.includes(cmd));

  for (const pattern of navPatterns) {
    for (const keyword of pattern.keywords) {
      if (messageLower.includes(keyword.toLowerCase())) {
        // If explicit navigation command or just subject name alone
        if (hasNavCommand || messageLower.trim() === keyword.toLowerCase()) {
          return { type: "navigate", target: pattern.target };
        }
      }
    }
  }
  
  return null;
}

async function callGroq(prompt: string, apiKey: string, model: string) {
  try {
    const Groq = (await import("groq-sdk")).default;
    const client = new Groq({ apiKey });

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful bilingual (Bangla/English) science teacher for Bangladeshi class 9 students. " +
            "Rules:\n" +
            "1. Answer ONLY in the language specified by the user - never mix languages\n" +
            "2. For navigation requests, respond with NAVIGATE_TO:/page (e.g., NAVIGATE_TO:/physics)\n" +
            "3. For other questions, provide detailed, educational answers suitable for class 9 level\n" +
            "4. Use proper Markdown formatting:\n" +
            "   - **Bold** for headings and important terms\n" +
            "   - Numbered or bulleted lists for steps\n" +
            "   - ```language blocks for code\n" +
            "   - Line breaks for readability\n" +
            "5. Include practical examples when explaining concepts\n" +
            "6. Keep answers concise but informative (2-4 paragraphs max unless complexity requires more)\n" +
            "7. For Bangla responses, use proper Bengali script and grammar",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 1500,
      top_p: 0.9,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return text;
  } catch (e) {
    console.error("Groq call failed", e);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = (body.message ?? "").toString().trim();
    const language: "en" | "bn" = body.language === "bn" ? "bn" : "en";

    if (!message) {
      const reply = language === "bn" ? "কোনও প্রশ্ন পাওয়া যায়নি।" : "No question received.";
      return NextResponse.json({ reply, intent: { type: "answer" } });
    }

    const messageLower = message.toLowerCase();

    // Quick check for navigation intent
    const quickIntent = detectNavigationIntent(messageLower, language);
    if (quickIntent) {
      const reply = language === "bn" 
        ? "ঠিক আছে, আপনাকে সেই পেজে নিয়ে যাচ্ছি…" 
        : "Okay, taking you to that page…";
      return NextResponse.json({ reply, intent: quickIntent });
    }

    const key = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL_ID ?? "llama-3.3-70b-versatile";

    if (key) {
      const languageName = language === "bn" ? "Bangla (বাংলা)" : "English";
      const prompt = `Language: ${language}
User Question: ${message}

Instructions:
- Respond ONLY in ${languageName}
- If this is a navigation request (e.g., "go to physics", "open math"), respond with: NAVIGATE_TO:/target
- Otherwise, provide a helpful educational answer for class 9 students
- Use Markdown formatting for better readability
- Keep it concise but informative`;

      try {
        const raw = await callGroq(prompt, key, model);
        
        // Check for navigation token in response
        const navMatch = raw.match(/NAVIGATE_TO:\s*(\/\w+)/i);
        if (navMatch) {
          const target = navMatch[1];
          const reply = raw.replace(/NAVIGATE_TO:\s*\/\w+/i, "").trim()
            || (language === "bn" ? "ঠিক আছে, নিয়ে যাচ্ছি…" : "Okay, redirecting…");
          return NextResponse.json({ reply, intent: { type: "navigate", target } });
        }
        
        return NextResponse.json({ reply: raw, intent: { type: "answer" } });
      } catch (e) {
        console.warn("Groq call failed, using fallback", e);
        // Fall through to fallback
      }
    }

    // Fallback responses for common topics
    const fallbackAnswersEn: Record<string, string> = {
      motion: "**Motion** is the change in position of an object over time.\n\n**Types of motion:**\n1. Linear motion - movement in a straight line\n2. Circular motion - movement in a circle\n3. Periodic motion - repeating movement\n\nYou can explore motion concepts using the physics simulator!",
      force: "**Force** is a push or pull that can change an object's motion.\n\n**Key points:**\n- Measured in Newtons (N)\n- Can cause acceleration\n- Examples: friction, gravity, tension\n\n**Newton's Laws** govern how forces affect motion.",
      acceleration: "**Acceleration** is the rate of change of velocity.\n\n**Formula:** a = (v - u) / t\n- a = acceleration\n- v = final velocity\n- u = initial velocity\n- t = time\n\nAcceleration can be positive (speeding up) or negative (slowing down).",
      velocity: "**Velocity** is speed with direction.\n\n**Formula:** v = displacement / time\n\nUnlike speed, velocity considers the direction of motion. It's a vector quantity measured in m/s.",
    };

    const fallbackAnswersBn: Record<string, string> = {
      motion: "**গতি** হলো সময়ের সাথে কোনো বস্তুর অবস্থানের পরিবর্তন।\n\n**গতির প্রকার:**\n১. সরলরেখায় গতি\n২. বৃত্তাকার গতি\n৩. পর্যাবৃত্ত গতি\n\nপদার্থবিজ্ঞান সিমুলেটরে গতির ধারণা দেখতে পারেন!",
      force: "**বল** হলো ধাক্কা বা টান যা বস্তুর গতি পরিবর্তন করতে পারে।\n\n**মূল বিষয়:**\n- নিউটনে (N) পরিমাপ করা হয়\n- ত্বরণ সৃষ্টি করতে পারে\n- উদাহরণ: ঘর্ষণ, মাধ্যাকর্ষণ, টান\n\n**নিউটনের সূত্র** বলের প্রভাব ব্যাখ্যা করে।",
      acceleration: "**ত্বরণ** হলো বেগের পরিবর্তনের হার।\n\n**সূত্র:** a = (v - u) / t\n- a = ত্বরণ\n- v = শেষ বেগ\n- u = প্রাথমিক বেগ\n- t = সময়\n\nত্বরণ ধনাত্মক (বেগ বৃদ্ধি) বা ঋণাত্মক (বেগ হ্রাস) হতে পারে।",
      velocity: "**বেগ** হলো দিকসহ দ্রুতি।\n\n**সূত্র:** v = সরণ / সময়\n\nদ্রুতির থেকে ভিন্ন, বেগে দিক বিবেচনা করা হয়। এটি m/s এককে পরিমাপ করা একটি ভেক্টর রাশি।",
    };

    // Check fallback keywords
    const fallbacks = language === "bn" ? fallbackAnswersBn : fallbackAnswersEn;
    for (const [keyword, answer] of Object.entries(fallbacks)) {
      if (messageLower.includes(keyword)) {
        return NextResponse.json({ reply: answer, intent: { type: "answer" } });
      }
    }

    // Default fallback
    const defaultReply = language === "bn"
      ? "দুঃখিত, আমি সেটা ভালোভাবে বুঝতে পারিনি। আপনি কি একটু ভিন্নভাবে জিজ্ঞাসা করতে পারেন?"
      : "Sorry, I couldn't understand that clearly. Could you please rephrase your question?";
    
    return NextResponse.json({ reply: defaultReply, intent: { type: "answer" } });
  } catch (err) {
    console.error("Educator route error:", err);
    return NextResponse.json(
      { 
        reply: "An error occurred. Please try again.", 
        intent: { type: "answer" } 
      },
      { status: 500 }
    );
  }
}