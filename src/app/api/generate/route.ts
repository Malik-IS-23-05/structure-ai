import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Настройки для разных "персон" (моделей)
const PERSONAS: Record<string, string> = {
  universal: "You are a helpful educational tutor. Explain clearly and simply.",
  dev: "You are a Senior Software Engineer. Use technical terminology, focus on architecture, patterns, and best practices. Be concise.",
  academic: "You are a University Professor. Be academic, rigorous, and detailed. Cite concepts and historical context where appropriate.",
  creative: "You are a Creative Strategist. Use analogies, metaphors, and think outside the box. Be inspiring.",
};

export async function POST(req: Request) {
  try {
    const { topic, modelType } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Выбираем персону или берем универсальную по умолчанию
    const personaInstruction = PERSONAS[modelType as string] || PERSONAS['universal'];

    const SYSTEM_PROMPT = `
${personaInstruction}
You are the engine of "Structura.ai".
Your goal is to accept a topic and generate a structured learning response in STRICT JSON format.

Output: A single JSON object with the following schema:
{
  "topic": "String (Refined topic title)",
  "roadmap": [
    {
      "step": 1,
      "title": "String (Short step name)",
      "description": "String (Concise explanation)",
      "resources": ["String (Search term for this step)"]
    }
  ],
  "mermaid_code": "String (Valid Mermaid.js graph TD code)"
}

Constraints:
1. The mermaid code must be a top-down flowchart (graph TD).
2. **CRITICAL: ALL node labels MUST be enclosed in double quotes.** - WRONG: A[Concept (Basic)]
   - RIGHT: A["Concept (Basic)"]
   - This is strictly required to prevent syntax errors with special characters.
3. Ensure the JSON is valid and parseable.
4. Language: Russian (unless user asks in English).
`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + `\n\nInput Topic: "${topic}"` }] }
      ]
    });

    const response = result.response;
    const text = response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}