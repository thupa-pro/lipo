import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VoiceCommandSchema = z.object({
  command: z.string().min(1),
  language: z.string(),
  context: z.any().optional(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command, language, context, timestamp } = VoiceCommandSchema.parse(body);

    // System prompt for voice command processing
    const systemPrompt = `You are an advanced AI assistant for Loconomy, a premium local services marketplace. 
    Process voice commands in ${language} and provide helpful, contextual responses.
    
    Context: ${JSON.stringify(context)}
    
    Available actions:
    - Book a service
    - Search for providers
    - Check booking status
    - Get recommendations
    - Manage account
    - Control smart home devices (if applicable)
    - Navigate the app
    
    Respond in ${language} with a natural, helpful tone. Keep responses concise but informative.
    If the command involves booking or payment, ask for confirmation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: command,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process that command. Please try again.";

    // Log the interaction for analytics
    console.log(`Voice command processed: ${command} -> ${response}`);

    return NextResponse.json({
      response,
      language,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - new Date(timestamp).getTime(),
    });

  } catch (error) {
    console.error("Voice command processing error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process voice command" },
      { status: 500 }
    );
  }
}