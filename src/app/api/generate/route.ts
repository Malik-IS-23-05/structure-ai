import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Инициализация клиента
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Системный промпт (Точно по ТЗ)
const SYSTEM_PROMPT = `
You are the engine of "Structura.ai", an educational tool.
Your goal is to accept a topic from the user and generate a structured learning response in STRICT JSON format.

The user wants to understand a topic in two ways simultaneously:
1. A Roadmap (Step-by-step linear guide).
2. A System Diagram (Visual structure using Mermaid.js syntax).

Output: A single JSON object with the following schema:
{
  "topic": "String (Refined topic title)",
  "roadmap": [
    {
      "step": 1,
      "title": "String (Short step name)",
      "description": "String (Concise explanation, max 2 sentences)",
      "resources": ["String (Search term for this step)"]
    }
  ],
  "mermaid_code": "String (Valid Mermaid.js graph TD code. Use simple node shapes. Do NOT use markdown code blocks, just the raw string)"
}

Constraints:
- The mermaid code must be a top-down flowchart (graph TD).
- Ensure the JSON is valid and parseable.
- Tone: Educational, structural, concise.
- Language: Russian (unless user asks in English).
`;

export async function POST(req: Request) {
  try {
    // 1. Получаем тему от фронтенда
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // 2. Настраиваем модель (используем быструю и дешевую Flash)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json", // Гарантирует JSON на выходе
      }
    });

    // 3. Отправляем запрос
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + `\n\nInput Topic: "${topic}"` }] }
      ]
    });

    // 4. Обрабатываем ответ
    const response = result.response;
    const text = response.text();
    
    // Парсим JSON (на случай, если модель добавит лишние пробелы)
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