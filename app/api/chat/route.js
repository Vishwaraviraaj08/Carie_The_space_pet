import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyDXDvbh5_evGQYmyDoxgGEDud1uVYpJEdU";

export async function POST(req) {
  const { message } = await req.json();

  const genAI = new GoogleGenerativeAI(API_KEY);
  const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Respond with an empathetic and motivational message for someone feeling stressed. Be positive, supportive, and encouraging. Message: "${message}"`;

  try {
    const result = await modelInstance.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ message: response }), { status: 200 });

  } catch (error) {
    console.error("Error:", error);

    return new Response(JSON.stringify({ message: "Error Generating Text" }), {
      status: 200,
    });
  }
}
