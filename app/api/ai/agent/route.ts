import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loconomyAgent, AgentContext } from "@/lib/ai/loconomy-agent";

export async function POST(request: NextRequest) {
  try {
    const { input, context: clientContext } = await request.json();

    if (!input) {
      return NextResponse.json(
        { message: "Input is required" },
        { status: 400 }
      );
    }

    // Get user session for context
    const session = await getServerSession(authOptions);
    
    // Build agent context
    const context: AgentContext = {
      userId: session?.user?.id,
      userRole: session?.user?.role,
      location: clientContext?.location || 'Unknown',
      currentPage: clientContext?.currentPage || 'unknown',
      sessionMemory: clientContext?.sessionMemory || {},
    };

    // Process input through the agent
    const response = await loconomyAgent.processInput(input, context);

    // Store interaction in memory if user is logged in
    if (session?.user?.id) {
      loconomyAgent.setMemory(session.user.id, 'lastInteraction', {
        input,
        response: response.content,
        timestamp: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      response,
      context,
    }, { status: 200 });

  } catch (error) {
    console.error("AI Agent error:", error);
    return NextResponse.json(
      { 
        message: "Sorry, I encountered an error. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const currentPage = searchParams.get('page') || 'unknown';

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    switch (action) {
      case 'suggestions':
        const suggestions = loconomyAgent.predictIntent(session.user.id, currentPage);
        return NextResponse.json({ suggestions }, { status: 200 });

      case 'memory':
        const memory = loconomyAgent.getMemory(session.user.id);
        return NextResponse.json({ memory }, { status: 200 });

      case 'commands':
        // Return available slash commands
        const commands = [
          { command: 'find', description: 'Find services near you', example: '/find plumber' },
          { command: 'book', description: 'Book a service', example: '/book cleaning tomorrow' },
          { command: 'reschedule', description: 'Reschedule a booking', example: '/reschedule' },
          { command: 'cancel', description: 'Cancel a booking', example: '/cancel' },
          { command: 'status', description: 'Check booking status', example: '/status' },
          { command: 'refer', description: 'Refer a friend', example: '/refer friend@email.com' },
          { command: 'escalate', description: 'Get help from support', example: '/escalate issue description' },
          { command: 'help', description: 'Show available commands', example: '/help' },
        ];
        return NextResponse.json({ commands }, { status: 200 });

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("AI Agent GET error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}