import { NextResponse } from "next/server";
import Fuse from "fuse.js";

// --- Step 1: Navigation Map ---
const navigationData = [
  // Main subjects
  { name: "physics", url: "/physics" },
  { name: "পদার্থবিজ্ঞান", url: "/physics" },
  { name: "পদার্থ", url: "/physics" },

  { name: "math", url: "/math" },
  { name: "গণিত", url: "/math" },
  { name: "ম্যাথ", url: "/math" },

  { name: "chemistry", url: "/chemistry" },
  { name: "রসায়ন", url: "/chemistry" },
  { name: "কেমিস্ট্রি", url: "/chemistry" },

  { name: "biology", url: "/biology" },
  { name: "জীববিজ্ঞান", url: "/biology" },
  { name: "জীব", url: "/biology" },

  { name: "ict", url: "/ict" },
  { name: "তথ্য", url: "/ict" },
  { name: "আইসিটি", url: "/ict" },

  // Physics subpages
  { name: "motion", url: "/physics/motion" },
  { name: "গতি", url: "/physics/motion" },

  { name: "gravity", url: "/physics/gravity" },
  { name: "মাধ্যাকর্ষণ", url: "/physics/gravity" },

  { name: "optics", url: "/physics/optics" },
  { name: "আলোকবিজ্ঞান", url: "/physics/optics" },

  { name: "solar", url: "/physics/solar" },
  { name: "সৌর", url: "/physics/solar" },

  // Math subpages
  { name: "graphs", url: "/math/graphs" },
  { name: "গ্রাফ", url: "/math/graphs" },

  { name: "vector", url: "/math/vector" },
  { name: "ভেক্টর", url: "/math/vector" },

  // Chemistry subpages
  { name: "atoms", url: "/chemistry/atoms" },
  { name: "পরমাণু", url: "/chemistry/atoms" },

  { name: "molecules", url: "/chemistry/molecules" },
  { name: "অণু", url: "/chemistry/molecules" },

  { name: "ph scale", url: "/chemistry/ph-scale" },
  { name: "ph", url: "/chemistry/ph-scale" },
  { name: "পিএইচ", url: "/chemistry/ph-scale" },

  { name: "states", url: "/chemistry/states" },
  { name: "অবস্থা", url: "/chemistry/states" },

  // Biology subpages
  { name: "anatomy", url: "/biology/anatomy" },
  { name: "শারীরস্থান", url: "/biology/anatomy" },

  { name: "cells", url: "/biology/cells" },
  { name: "কোষ", url: "/biology/cells" },

  { name: "ecology", url: "/biology/ecology" },
  { name: "পরিবেশবিজ্ঞান", url: "/biology/ecology" },

  { name: "genetics", url: "/biology/genetics" },
  { name: "বংশগতি", url: "/biology/genetics" },

  // Biology cells subpages
  { name: "animal cell", url: "/biology/cells/animal-cell" },
  { name: "প্রাণী কোষ", url: "/biology/cells/animal-cell" },

  { name: "plant cell", url: "/biology/cells/plant-cell" },
  { name: "উদ্ভিদ কোষ", url: "/biology/cells/plant-cell" },

  { name: "chloroplast", url: "/biology/cells/chloroplast" },
  { name: "ক্লোরোপ্লাস্ট", url: "/biology/cells/chloroplast" },

  { name: "mitochondria", url: "/biology/cells/mitochondria" },
  { name: "মাইটোকন্ড্রিয়া", url: "/biology/cells/mitochondria" },

  { name: "nucleus", url: "/biology/cells/nucleus" },
  { name: "নিউক্লিয়াস", url: "/biology/cells/nucleus" },

  { name: "eukaryotic cell", url: "/biology/cells/eukaryotic-cell" },
  { name: "ইউক্যারিওটিক কোষ", url: "/biology/cells/eukaryotic-cell" },

  { name: "eukaryotic plant cell", url: "/biology/cells/eukaryotic-plant-cell" },
  { name: "ইউক্যারিওটিক উদ্ভিদ কোষ", url: "/biology/cells/eukaryotic-plant-cell" },

  // ICT subpages
  { name: "ai", url: "/ict/ai" },
  { name: "কৃত্রিম বুদ্ধিমত্তা", url: "/ict/ai" },

  { name: "machine learning", url: "/ict/ai/machine-learning" },
  { name: "মেশিন লার্নিং", url: "/ict/ai/machine-learning" },

  { name: "neural networks", url: "/ict/ai/neural-networks" },
  { name: "নিউরাল নেটওয়ার্ক", url: "/ict/ai/neural-networks" },

  { name: "circuit construction", url: "/ict/circuit-construction" },
  { name: "সার্কিট নির্মাণ", url: "/ict/circuit-construction" },

  { name: "computer hardware", url: "/ict/computer-hardware" },
  { name: "কম্পিউটার হার্ডওয়্যার", url: "/ict/computer-hardware" },

  { name: "computer parts", url: "/ict/computer-hardware/computer-parts" },
  { name: "কম্পিউটার যন্ত্রাংশ", url: "/ict/computer-hardware/computer-parts" },

  { name: "motherboard", url: "/ict/computer-hardware/motherboard" },
  { name: "মাদারবোর্ড", url: "/ict/computer-hardware/motherboard" },

  { name: "quantum computer", url: "/ict/computer-hardware/quantum-computer" },
  { name: "কোয়ান্টাম কম্পিউটার", url: "/ict/computer-hardware/quantum-computer" },

  { name: "logic gates", url: "/ict/logic-gates" },
  { name: "লজিক গেট", url: "/ict/logic-gates" },

  { name: "programming", url: "/ict/programming" },
  { name: "প্রোগ্রামিং", url: "/ict/programming" },

  { name: "c programming", url: "/ict/programming/c" },
  { name: "c প্রোগ্রামিং", url: "/ict/programming/c" },

  { name: "database", url: "/ict/programming/database" },
  { name: "ডাটাবেস", url: "/ict/programming/database" },

  { name: "html", url: "/ict/programming/html" },
  { name: "এইচটিএমএল", url: "/ict/programming/html" },

  { name: "python", url: "/ict/programming/python" },
  { name: "পাইথন", url: "/ict/programming/python" },
];

// Initialize Fuse.js
const fuse = new Fuse(navigationData, {
  keys: ["name"],
  threshold: 0.5,
  includeScore: true,
});

const navCommands = ["go to", "open", "show", "খোলা", "যাও", "দেখাও"];

function detectNavigationFuzzy(message: string) {
  const lower = message.toLowerCase();

  // Only proceed if explicit navigation command (not short random words)
  const isCommand = navCommands.some(cmd => lower.startsWith(cmd + " "));

  if (!isCommand) return null;

  // Extract potential target by removing navigation commands
  let searchTerm = lower;
  for (const cmd of navCommands) {
    if (lower.startsWith(cmd + " ")) {
      searchTerm = lower.slice(cmd.length + 1).trim();
      break;
    }
  }

  const result = fuse.search(searchTerm);
  if (result.length > 0 && result[0].score! < 0.5) {
    return { type: "navigate", target: result[0].item.url };
  }

  return null;
}

// --- Step 3: Call Groq AI ---
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
            "You are a muslim helpful bilingual (Bangla/English) science teacher for Bangladeshi class 9-10 students. " +
            "Rules:\n" +
            "1. Answer ONLY in the language specified by the user - never mix languages\n" +
            "2. For any navigation, do NOT return URLs. Navigation is handled separately.\n" +
            "3. For other questions, provide detailed, educational answers suitable for class 9 level\n" +
            "4. Use proper Markdown formatting\n" +
            "5. Include examples and keep answers concise but informative",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 0.9,
      stream: true,
    });

    return completion;
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
    const quickIntent = detectNavigationFuzzy(messageLower);
    if (quickIntent) {
      const reply = language === "bn" 
        ? "ঠিক আছে, আপনাকে সেই পেজে নিয়ে যাচ্ছি…" 
        : "Okay, taking you to that page…";
      return NextResponse.json({ reply, intent: quickIntent });
    }

    // --- Step 4b: Call AI for answers ---
    const key = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL_ID ?? "llama-3.3-70b-versatile";

    if (!key) {
      return NextResponse.json({
        reply: language === "bn"
          ? "দুঃখিত, সার্ভারে সংযোগ করা যায়নি।"
          : "Sorry, unable to connect to server.",
        intent: { type: "answer" }
      });
    }

    const languageName = language === "bn" ? "Bangla (বাংলা)" : "English";
    const prompt = `Language: ${language}
User Question: ${message}

Instructions:
- Respond ONLY in ${languageName}
- Do NOT attempt navigation
- Provide helpful, educational answers for class 9 students
- Use Markdown formatting for better readability
- Keep it concise but informative`;

    const aiStream = await callGroq(prompt, key, model);

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

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