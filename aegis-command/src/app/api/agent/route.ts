import { NextResponse } from 'next/server';
import { enterpriseSupervisorFlow } from '@/lib/ai/orchestrator';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { currentGate, density } = await req.json();
    const encoder = new TextEncoder();
    
    // Create a ReadableStream to push Server-Sent Events (SSE)
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Execute the Genkit Flow
          const agentStream = await enterpriseSupervisorFlow.stream({ currentGate, density });
          
          for await (const chunk of agentStream.stream) {
            let ssePayload = '';
            
            // TYPED ENVELOPE PARSING
            if (chunk.type === 'tool_call') {
              // Tell the frontend to animate the "Tool Activity" UI
              ssePayload = `event: tool\ndata: ${JSON.stringify({ tool: chunk.toolName, status: 'executing' })}\n\n`;
            } else if (chunk.type === 'text') {
              // Standard text generation
              ssePayload = `event: text\ndata: ${JSON.stringify({ text: chunk.text })}\n\n`;
            } else if (chunk.type === 'thought') {
              // The internal reasoning (The Glass Backend)
              ssePayload = `event: thought\ndata: ${JSON.stringify({ logic: chunk.thought })}\n\n`;
            }
            
            if (ssePayload) controller.enqueue(encoder.encode(ssePayload));
          }
          
          // Close the stream cleanly
          controller.enqueue(encoder.encode(`event: done\ndata: {"status": "complete"}\n\n`));
          controller.close();
          
        } catch (streamError) {
          console.error("[AGENT STREAM ERROR]", streamError);
          controller.enqueue(encoder.encode(`event: error\ndata: {"message": "Agent Deadlock Detected"}\n\n`));
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request Payload" }, { status: 400 });
  }
}
