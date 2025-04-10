import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyDXDvbh5_evGQYmyDoxgGEDud1uVYpJEdU";

export async function POST(req) {
  const { message, emotion } = await req.json();

  const genAI = new GoogleGenerativeAI(API_KEY);
  const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Communicate with someone who has the emotion ${emotion }. Mention the emotion in the answer.  if the emotion is happy or neutral, promote and progressive talking. if the emotion is sad, motivate and encourage with positive words according to the situation. Be positive, supportive, and encouraging. Message: "${message}"`;

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
