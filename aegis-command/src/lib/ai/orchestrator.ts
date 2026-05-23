// CRITICAL: Import z from 'genkit', NOT from 'zod'.
// genkit bundles its own Zod instance; using a separate 'zod' package causes
// ZodTypeAny incompatibility errors in defineTool/defineFlow overloads.
import { genkit, z } from 'genkit';

// ==========================================
// GENKIT INSTANCE
// ==========================================
const ai = genkit({});

// ==========================================
// SHARED SCHEMAS
// ==========================================

/**
 * AIFallbackRoutingSchema — mirrors the Zod schema in src/lib/validations.ts.
 * Must be kept in sync. This is the strict output contract for the routing worker.
 */
export const AIFallbackRoutingSchema = z.object({
  target_gate: z.string(),
  reasoning: z.string().max(100),
  density_delta: z.number().int(),
});

export type AIFallbackRouting = z.infer<typeof AIFallbackRoutingSchema>;

// ==========================================
// WORKER: ROUTING AGENT
// Evaluates a gate's density and emits a structured rerouting payload
// when density exceeds the Orange threshold (> 75%).
// ==========================================
export const routingAgentWorker = ai.defineTool(
  {
    name: 'routingAgentWorker',
    description:
      'Evaluates stadium block density. When density > 75 (Orange zone), generates a Vanguard gamification rerouting payload targeting a less-congested gate.',
    inputSchema: z.object({
      currentGate: z.string().describe('The gate block_id currently being evaluated, e.g. "GATE_7"'),
      density: z.number().int().min(0).max(100).describe('Current crowd density percentage (0-100)'),
    }),
    outputSchema: z.string().describe(
      'Stringified JSON conforming to AIFallbackRoutingSchema, or "NO_ACTION" if density is safe.'
    ),
  },
  async ({ currentGate, density }) => {
    // Fast-path: below Orange threshold, no rerouting needed
    if (density <= 75) {
      return 'NO_ACTION';
    }

    const prompt = `
You are the Aegis Vanguard Routing Sub-Agent. A stadium block has crossed the Orange density threshold.

INPUTS:
- Congested Gate: ${currentGate}
- Current Density: ${density}%

TASK:
Identify a suitable adjacent gate for fan rerouting and compute the Vanguard gamification bounty.
Output ONLY a single line of minified JSON matching this exact schema:
{ "target_gate": "<gate_id>", "reasoning": "<max 100 chars>", "density_delta": <negative integer> }

Do NOT output markdown, commentary, or any text outside the JSON object.
`.trim();

    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      system:
        'You are a specialized crowd-flow routing agent for Project Aegis. Output only valid minified JSON. Never hallucinate gate IDs that were not implied by the input.',
      messages: [{ role: 'user', content: [{ text: prompt }] }],
      config: { temperature: 0.2 },
    });

    const rawText = (response.text ?? '').trim();

    // Validate against the Zod schema before returning — prevents frontend parse crashes
    try {
      const parsed = AIFallbackRoutingSchema.parse(JSON.parse(rawText));
      return JSON.stringify(parsed);
    } catch {
      console.error('[ROUTING WORKER] Invalid model output, using safe fallback:', rawText);
      const fallback: AIFallbackRouting = {
        target_gate: 'GATE_OVERFLOW',
        reasoning: 'AI output malformed; using safe fallback gate.',
        density_delta: -10,
      };
      return JSON.stringify(fallback);
    }
  }
);

// ==========================================
// SUPERVISOR: ENTERPRISE FLOW
// Evaluates a density event and delegates to routingAgentWorker.
// ==========================================
export const enterpriseSupervisorFlow = ai.defineFlow(
  {
    name: 'enterpriseSupervisorFlow',
    inputSchema: z.object({
      currentGate: z.string(),
      density: z.number().int().min(0).max(100),
    }),
    outputSchema: z.object({
      action: z.enum(['NO_ACTION', 'REROUTE']),
      payload: AIFallbackRoutingSchema.optional(),
      supervisorReasoning: z.string(),
    }),
  },
  async ({ currentGate, density }) => {
    const supervisorPrompt = `
Stadium gate "${currentGate}" is reporting ${density}% crowd density.
Evaluate whether this warrants a Vanguard rerouting event.
- If density > 75: call the 'routingAgentWorker' tool to generate a rerouting payload.
- If density <= 75: respond that no action is required.
Keep your supervisorReasoning to a single sentence.
`.trim();

    const response = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      system:
        'You are the Aegis Chief Supervisor. Evaluate stadium density events and delegate rerouting decisions to the routingAgentWorker tool. maxTurns is enforced — do not loop.',
      messages: [{ role: 'user', content: [{ text: supervisorPrompt }] }],
      tools: [routingAgentWorker],
      maxTurns: 4, // Deadlock prevention
    });

    // After maxTurns, Genkit resolves the final structured response.
    // If the supervisor called routingAgentWorker, its output is embedded in response.text as JSON.
    // We attempt to parse it; if not parseable, we treat it as a NO_ACTION reasoning string.
    const finalText = (response.text ?? '').trim();

    try {
      const payload = AIFallbackRoutingSchema.parse(JSON.parse(finalText));
      return {
        action: 'REROUTE' as const,
        payload,
        supervisorReasoning: `Density at ${currentGate} exceeded Orange threshold. Vanguard rerouting dispatched.`,
      };
    } catch {
      // Final text was prose, not a routing JSON — safe NO_ACTION path
    }

    return {
      action: 'NO_ACTION' as const,
      supervisorReasoning: finalText || `Density at ${currentGate} is within safe parameters.`,
    };
  }
);
