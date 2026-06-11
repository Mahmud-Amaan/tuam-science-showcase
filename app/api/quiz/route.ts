import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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
  
  if (searchKey === "/") return null;
  
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contextPath: string = body.contextPath || "/";
    const language: "en" | "bn" = body.language === "bn" ? "bn" : "en";
    const questionCount: number = typeof body.questionCount === "number" ? body.questionCount : 10;
    const studentClass: string = body.studentClass ? String(body.studentClass) : "10";

    const guide = findSimulationGuide(contextPath);
    if (!guide) {
      return NextResponse.json({
        error: language === "bn" ? "সিমুলেশন খুঁজে পাওয়া যায়নি।" : "Simulation not found."
      }, { status: 404 });
    }

    const key = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL_ID ?? "meta-llama/llama-4-scout-17b-16e-instruct";

    if (!key) {
      return NextResponse.json({
        error: "Server configuration error (missing key)."
      }, { status: 500 });
    }

    const Groq = (await import("groq-sdk")).default;
    const client = new Groq({ apiKey: key });

    const languageName = language === "bn" ? "Bangla (বাংলা)" : "English";

    const prompt = `You are an expert bilingual science educator. Generate a conceptual multiple-choice quiz of exactly ${questionCount} questions about the following simulation context:
Simulation Name: ${guide.name}
Description: ${guide.description}
Concepts: ${guide.concepts.join(", ")}
${guide.formulas ? `Formulas: ${guide.formulas.join(", ")}` : ""}

Output must be a valid JSON object ONLY, with a single top-level key "questions" containing an array of ${questionCount} question objects.
IMPORTANT: Return ONLY the raw JSON string. Do NOT wrap it in markdown code blocks like \`\`\`json or add any explanation outside of the JSON.

Each question object in the array must have exactly the following keys:
1. "question": string (the question text)
2. "options": array of 4 strings (multiple choice options)
3. "correctIndex": number (index 0 to 3 of the correct option)
4. "explanation": string (brief, clear explanation of why that option is correct)

All text, questions, options, and explanations must be strictly and completely written in ${languageName}. 
Make sure the difficulty, terminology, depth, and mathematical complexity of the questions are strictly tailored for Class/Grade ${studentClass} standard. The questions must vary in difficulty (some easy recall, some conceptual, some formula/numerical application if formulas exist).`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a JSON generator. You output ONLY raw valid JSON containing a science quiz."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 4096,
      response_format: { type: "json_object" }
    });

    const reply = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(reply.trim());

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Quiz API Error:", error);
    return NextResponse.json({
      error: "Failed to generate quiz",
      details: error.message
    }, { status: 500 });
  }
}
