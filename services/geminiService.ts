import { GoogleGenAI, Type } from "@google/genai";
import { Message } from '../types';

const apiKey = process.env.API_KEY;

// We use the flash model for fast, creative text generation
const MODEL_NAME = "gemini-2.5-flash";

export const generateConversation = async (
  topic: string, 
  tone: string, 
  count: number
): Promise<Partial<Message>[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a realistic Instagram DM conversation between two people.
  Topic: ${topic}
  Tone: ${tone}
  Length: Approximately ${count} messages.
  
  The output must be a strictly formatted JSON array.
  'sender' must be exactly 'me' or 'them'.
  'text' should contain the message content, including emojis if appropriate for the tone.
  Do not include timestamps or IDs, just the raw message data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a social media expert. Create realistic, engaging, and believable chat logs.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sender: {
                type: Type.STRING,
                enum: ["me", "them"]
              },
              text: {
                type: Type.STRING
              }
            },
            required: ["sender", "text"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
