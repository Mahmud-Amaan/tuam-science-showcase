import { NextResponse } from "next/server";
import Fuse from "fuse.js";

// Configure runtime (Node.js needed for streaming and Groq SDK)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // Always fresh for AI responses
export const maxDuration = 30 // Max 30 seconds for streaming

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

  { name: "trigonometry", url: "/math/trigonometry" },
  { name: "trigonometry tour", url: "/math/trigonometry" },
  { name: "ত্রিকোণমিতি", url: "/math/trigonometry" },

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

  { name: "periodic table", url: "/chemistry/periodic-table" },
  { name: "interactive periodic table", url: "/chemistry/periodic-table" },
  { name: "পর্যায় সারণি", url: "/chemistry/periodic-table" },

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

// Function to extract context from a path
function extractContextFromPath(path: string) {
  // Remove leading slash and split
  const segments = path.replace(/^\/|\/$/g, "").split("/");
  if (segments.length === 0) return null;

  const context = {
    main: segments[0] || "",
    topic: segments[1] || "",
  };

  const topicName = context.topic
    ? `${context.main} - ${context.topic}` 
    : context.main;

  return topicName || null;
}

const simulationGuides: Record<string, {
  name: string;
  description: string;
  concepts: string[];
  formulas?: string[];
  suggestedActivity: string;
}> = {
  "/physics/motion": {
    name: "Motion & Kinematics",
    description: "An interactive linear motion simulator where students can set displacement, initial velocity, and constant acceleration, then view real-time position/velocity graphs.",
    concepts: ["Displacement (s)", "Velocity (v)", "Constant Acceleration (a)", "Kinematics equations"],
    formulas: ["v = u + at", "s = ut + 0.5at^2", "v^2 = u^2 + 2as"],
    suggestedActivity: "Set acceleration to 2 m/s² and watch how the velocity increases linearly while the displacement increases quadratically."
  },
  "/physics/gravity": {
    name: "Gravity",
    description: "An interactive gravitational attraction simulator. Students can change the masses of two objects and the distance between them to see how it affects the gravitational force.",
    concepts: ["Newton's Law of Universal Gravitation", "Gravitational constant (G)", "Mass vs. Weight", "Inverse-square relationship"],
    formulas: ["F = G * (m1 * m2) / r^2"],
    suggestedActivity: "Try doubling the mass of one object and notice how the force doubles. Then double the distance between them and see how the force drops to one-fourth."
  },
  "/physics/optics": {
    name: "Optics & Light",
    description: "A lens and light refraction simulator. Demonstrates how light rays bend when moving through different mediums (air, water, glass) and how lenses focus light.",
    concepts: ["Refraction", "Snell's Law", "Focal point", "Convex vs. Concave lenses", "Refractive Index"],
    formulas: ["n1 * sin(theta1) = n2 * sin(theta2)"],
    suggestedActivity: "Place a convex lens in the path of the light rays and adjust the focal length to see how the image flips or focuses."
  },
  "/physics/solar": {
    name: "Solar System",
    description: "A 3D solar system orbital simulator. Simulates planetary motion, Kepler's laws of planetary motion, and gravitational pull of the Sun.",
    concepts: ["Orbits", "Kepler's Laws", "Centripetal Force", "Orbital Velocity"],
    formulas: ["v = sqrt(G * M / r)"],
    suggestedActivity: "Compare the orbital speeds of inner planets (like Mercury) with outer planets (like Neptune) to see how speed decreases with distance."
  },
  "/chemistry/atoms": {
    name: "Atoms & Isotopes",
    description: "An interactive atom builder. Students can add protons, neutrons, and electrons to see how they form different elements, isotopes, and ions.",
    concepts: ["Protons, Neutrons, Electrons", "Atomic Number", "Mass Number", "Isotopes", "Ions & Charges"],
    suggestedActivity: "Add 6 Protons, 6 Neutrons, and 6 Electrons to construct a stable Carbon-12 atom."
  },
  "/chemistry/molecules": {
    name: "Molecular Shapes",
    description: "A 3D molecule building and visualization simulator showing covalent bonds and spatial molecule geometries.",
    concepts: ["Covalent Bonding", "Valence Shell Electron Pair Repulsion (VSEPR) theory", "Chemical Bonds", "Molecular Geometry"],
    suggestedActivity: "Build a water molecule (H2O) and look at its bent shape, which is caused by the lone pairs pushing the hydrogen atoms down."
  },
  "/chemistry/ph-scale": {
    name: "pH Scale",
    description: "An interactive pH testing simulation where students can test various everyday liquids (coffee, milk, soap, battery acid) and measure their pH values.",
    concepts: ["Acids and Bases", "Hydronium concentration (H3O+)", "pH = -log[H+]", "Logarithmic scale"],
    formulas: ["pH = -log10[H+]"],
    suggestedActivity: "Measure the pH of soap (basic) and compare it with orange juice (acidic). Add water to dilute them and observe how the pH moves closer to neutral 7."
  },
  "/chemistry/states": {
    name: "States of Matter",
    description: "A molecular-level simulation showing molecules of Neon, Argon, Oxygen, and Water in Solid, Liquid, and Gas phases as temperature changes.",
    concepts: ["Solids, Liquids, Gases", "Phase transitions (Melting, Vaporization)", "Thermal energy", "Intermolecular forces"],
    suggestedActivity: "Select Water, heat it up to 100°C (373 K) and watch how the hydrogen bonds break as it transitions into a gas."
  },
  "/chemistry/periodic-table": {
    name: "Interactive Periodic Table",
    description: "An interactive periodic table of elements showcasing element details, electronic configurations, and periodic trends.",
    concepts: ["Groups & Periods", "Atomic Radius", "Electronegativity", "Electron Configuration", "Valence Electrons"],
    suggestedActivity: "Explore group 1 (Alkali Metals) to see how they all have exactly 1 valence electron and become highly reactive."
  },
  "/biology/cells/animal-cell": {
    name: "Animal Cell Anatomy",
    description: "An interactive 3D model of an animal cell highlighting key organelles like Mitochondria, Nucleus, Ribosomes, and Cell Membrane.",
    concepts: ["Eukaryotic Cell", "Organelles & Functions", "Cell Membrane structure"],
    suggestedActivity: "Click on the Mitochondria to learn why it is called the powerhouse of the cell."
  },
  "/biology/cells/plant-cell": {
    name: "Plant Cell Anatomy",
    description: "An interactive 3D model of a plant cell showcasing chloroplasts, large vacuoles, and the rigid cell wall.",
    concepts: ["Plant vs Animal cells", "Cell Wall", "Chloroplasts & Photosynthesis", "Turgor pressure"],
    suggestedActivity: "Examine the Chloroplast and see how its double-membrane structure traps light to create chemical energy."
  },
  "/biology/anatomy": {
    name: "Human Anatomy",
    description: "An interactive human anatomy explorer highlighting skeletal, muscular, and major organ systems.",
    concepts: ["Skeletal system", "Circulatory system", "Respiratory system", "Organ coordination"],
    suggestedActivity: "Locate the rib cage and learn how it protects the lungs and the beating heart."
  },
  "/biology/ecology": {
    name: "Ecology & Ecosystems",
    description: "A simulation of ecological balance, food webs, and environmental carrying capacity.",
    concepts: ["Food Chains & Webs", "Producers vs Consumers", "Ecosystem balance", "Carrying capacity"],
    suggestedActivity: "Increase the population of primary consumers (rabbits) and notice how it temporarily depletes the grass before causing a consumer crash."
  },
  "/biology/genetics": {
    name: "Genetics & Punnett Squares",
    description: "A genetics simulation exploring Punnett squares, dominant vs recessive traits, and phenotype ratios.",
    concepts: ["Alleles", "Genotype vs Phenotype", "Dominant & Recessive inheritance", "Homozygous vs Heterozygous"],
    suggestedActivity: "Cross a homozygous dominant tall plant (TT) with a homozygous recessive short plant (tt) and observe the offspring phenotypes."
  },
  "/math/vector": {
    name: "Vectors & Magnitudes",
    description: "An interactive graph showing vectors. Students can adjust vector endpoints to see changes in components, magnitudes, and angles.",
    concepts: ["Vector addition", "Magnitude & Angle", "X & Y Components", "Pythagorean theorem in vectors"],
    formulas: ["Magnitude = sqrt(x^2 + y^2)", "Angle = atan2(y, x)"],
    suggestedActivity: "Drag a vector to (3, 4) and verify that its magnitude is exactly 5 using the Pythagorean theorem."
  },
  "/math/trigonometry": {
    name: "Trigonometry & Unit Circle",
    description: "An interactive unit circle simulator displaying sine, cosine, tangent values, and angles in radians/degrees.",
    concepts: ["Unit Circle", "Sine, Cosine, Tangent", "Radians vs Degrees", "Trigonometric ratios"],
    formulas: ["sin(theta) = y / r", "cos(theta) = x / r", "tan(theta) = y / x"],
    suggestedActivity: "Set the angle to 30 degrees (pi/6 radians) and notice that sin(30°) is exactly 0.5."
  },
  "/ict/logic-gates": {
    name: "Logic Gates Simulator",
    description: "An interactive digital circuit designer where students connect inputs, logic gates (AND, OR, NOT, XOR, NAND, NOR), and outputs.",
    concepts: ["Boolean Logic", "Truth Tables", "AND, OR, NOT gate states", "Binary inputs/outputs"],
    suggestedActivity: "Create a simple XOR gate circuit using AND, OR, and NOT gates, and test its truth table outputs."
  },
  "/ict/circuit-construction": {
    name: "Circuit Construction",
    description: "An interactive circuit builder with batteries, wires, resistors, light bulbs, switches, and meters (voltmeter, ammeter).",
    concepts: ["Ohm's Law", "Series vs Parallel circuits", "Voltage, Current, Resistance"],
    formulas: ["V = I * R", "P = V * I"],
    suggestedActivity: "Build a parallel circuit with two light bulbs and notice how unscrewing one bulb does not turn off the other."
  },
  "/ict/ai": {
    name: "Artificial Intelligence & ML",
    description: "An interactive machine learning visualizer showing neural network training and weight adjustments.",
    concepts: ["Supervised Learning", "Neural Network weights and biases", "Activation functions", "Loss minimization"],
    suggestedActivity: "Increase the number of hidden layers and retrain the network to see how it fits non-linear decision boundaries faster."
  },
  "/ict/programming": {
    name: "Programming Playground",
    description: "An interactive environment demonstrating programming syntax, loops, conditions, and debugging steps.",
    concepts: ["Variables & Types", "Conditional logic", "Loops (for, while)", "Function definitions"],
    suggestedActivity: "Write a simple loop that counts from 1 to 10 and prints the values, watching how variables change on each iteration."
  }
};

function findSimulationGuide(path: string) {
  if (!path) return null;
  const normalized = path.split('?')[0].replace(/^\/|\/$/g, "");
  const searchKey = "/" + normalized;
  
  if (simulationGuides[searchKey]) {
    return simulationGuides[searchKey];
  }
  
  for (const [key, value] of Object.entries(simulationGuides)) {
    if (searchKey.includes(key) || key.includes(searchKey)) {
      return value;
    }
  }
  return null;
}

// --- Step 3: Call Groq AI ---
async function callGroq(
  prompt: string, 
  apiKey: string, 
  model: string, 
  history: Array<{ role: string; content: string }> = [],
  speakerMode: boolean = false
) {
  try {
    const Groq = (await import("groq-sdk")).default;
    const client = new Groq({ apiKey });

    // Build messages array with system prompt, history, and current message
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content:
          "You are an expert bilingual (Bangla/English) science educator for students. Your goal is to help students learn by providing clear, engaging, and accurate explanations.\n\n" +
          "## Rules for Responses:\n" +
          "1. **Language**: Respond ONLY in the language the user is using. Never mix languages.\n" +
          "2. **Clarity & Socratic Method**: Break down complex ideas into simple, understandable parts. Start with an intuitive real-world analogy before introducing formal terminology. End explanations with a question that encourages the student to manipulate the simulation controls.\n" +
          "3. **Interactive Quiz Mode**: If the user asks for a quiz or test, or triggers a quiz suggestion:\n" +
          "   - Present exactly ONE multiple-choice question (with A, B, C, D options) relevant to the current page/topic.\n" +
          "   - Do NOT give the answer right away. Wait for the user's response.\n" +
          "   - Once the user responds, provide positive feedback, reveal the correct answer, and explain the science behind it.\n" +
          "4. **Formatting**: Use Markdown to enhance readability:\n" +
          "   - **Bold** for key terms and concepts\n" +
          "   - Headings (##) for section titles\n" +
          "   - Bullet points (-) for lists\n" +
          "   - Numbered lists (1.) for sequences or steps\n" +
          "   - Code blocks (```) for formulas, code, and scientific notation\n" +
          "   - Short paragraphs (2-3 sentences max)\n" +
          "5. **Simulation Guides**: If details about the active simulation are provided in the prompt, reference them directly. Tell the student how to use the simulation sliders, inputs, or buttons to observe the phenomena you are describing (e.g., 'Try increasing the slider to...').\n" +
          "6. **Speaker Mode**: " + (speakerMode ? "Reply in 1-2 complete sentences (40 words or fewer). Do not use lists, headings, or bullet points." : "Keep responses concise and well-structured, but thorough.")
      },
      // Add conversation history
      ...history.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      // Add current message
      { role: "user" as const, content: prompt },
    ];

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_completion_tokens: speakerMode ? 180 : 2048,
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
    const history: Array<{ role: string; content: string }> = body.history ?? [];
    const speakerMode: boolean = body.speakerMode ?? false;

    if (!message) {
      const reply = language === "bn" ? "কোনও প্রশ্ন পাওয়া যায়নি।" : "No question received.";
      return NextResponse.json({ reply, intent: { type: "answer" } });
    }

    const messageLower = message.toLowerCase();

    // Detect simulation context
    const referer = req.headers.get("referer") || "";
    const contextPath = body.contextPath || referer.split("/").slice(3).join("/") || "/";
    const simulationContext = extractContextFromPath(contextPath);

    const guide = findSimulationGuide(contextPath);
    let guideContext = "";
    if (guide) {
      guideContext = `
[Active Simulation Details]
Name: ${guide.name}
Description: ${guide.description}
Key Concepts to Teach: ${guide.concepts.join(", ")}
${guide.formulas ? `Relevant Formulas: ${guide.formulas.join(", ")}` : ""}
Suggested Hands-on Activity for student in simulation: ${guide.suggestedActivity}
`;
    }

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
    const model = process.env.GROQ_MODEL_ID ?? "meta-llama/llama-4-scout-17b-16e-instruct";

    if (!key) {
      return NextResponse.json({
        reply: language === "bn"
          ? "দুঃখিত, সার্ভারে সংযোগ করা যায়নি।"
          : "Sorry, unable to connect to server.",
        intent: { type: "answer" }
      });
    }

    const languageName = language === "bn" ? "Bangla (বাংলা)" : "English";
    const contextInfo = simulationContext ? `[Current Context: ${simulationContext}] ` : "";
    const prompt = `Language: ${languageName}
${contextInfo}
${guideContext}
User Question: ${message}

Instructions:
- Respond ONLY in ${languageName}
- Provide helpful, educational answers suitable for students
- Use proper Markdown formatting (bold for key terms, headings for sections, lists for multiple points)
- Keep answers concise but informative
- Use context from previous messages to provide relevant answers
- Include examples when helpful` +
      (speakerMode ? "\n- **Speaker Mode**: Respond with exactly 1-2 complete sentences of 40 words or fewer, no bullet points." : "");

    const aiStream = await callGroq(prompt, key, model, history, speakerMode);

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