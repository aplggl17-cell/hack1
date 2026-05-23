import { useState, useRef, useCallback } from 'react';

export type AgentState = 'idle' | 'thinking' | 'executing_tool' | 'streaming_text' | 'complete' | 'error';

interface ToolActivity {
  tool: string;
  status: 'executing' | 'done';
}

export function useAgentStream() {
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [finalText, setFinalText] = useState<string>('');
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<ToolActivity | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeAgentQuery = useCallback(async (currentGate: string, density: number) => {
    // Reset state for new query
    setAgentState('thinking');
    setFinalText('');
    setThoughts([]);
    setActiveTool(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentGate, density }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // SSE messages are separated by double newlines
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the incomplete chunk in the buffer

        for (const eventStr of events) {
          if (!eventStr.trim()) continue;

          // Parse the SSE envelope
          const eventMatch = eventStr.match(/event:\s*(.*?)\n/);
          const dataMatch = eventStr.match(/data:\s*(.*)/);
          
          const eventType = eventMatch ? eventMatch[1].trim() : 'message';
          const eventData = dataMatch ? JSON.parse(dataMatch[1].trim()) : null;

          if (!eventData) continue;

          // STATE MACHINE ROUTING
          if (eventType === 'thought') {
            setAgentState('thinking');
            setThoughts((prev) => [...prev, eventData.logic]);
          } 
          else if (eventType === 'tool') {
            setAgentState('executing_tool');
            setActiveTool({ tool: eventData.tool, status: eventData.status });
          } 
          else if (eventType === 'text') {
            setAgentState('streaming_text');
            setActiveTool(null); // Clear tool UI once text starts flowing
            setFinalText((prev) => prev + eventData.text);
          } 
          else if (eventType === 'done') {
            setAgentState('complete');
            setActiveTool(null);
          }
          else if (eventType === 'error') {
            setAgentState('error');
            console.error("[AGENT ERROR]", eventData.message);
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Agent stream aborted by user.');
      } else {
        setAgentState('error');
      }
    }
  }, []);

  const stopAgent = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setAgentState('idle');
    }
  };

  return { executeAgentQuery, stopAgent, agentState, finalText, thoughts, activeTool };
}
