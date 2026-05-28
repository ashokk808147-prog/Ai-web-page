import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Use the last user message to prompt
    const lastUserMessage = messages[messages.length - 1].content;

    // Call the Gemini model using streaming
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: lastUserMessage,
      config: {
        systemInstruction: "You are a helpful, professional AI agent. You communicate concisely and clearly, focusing on delivering solutions efficiently. You are running in a sleek, cosmic slate-themed interface.",
      }
    });

    // Create a ReadableStream from the generator
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    return new Response(JSON.stringify({ error: error.message || 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
