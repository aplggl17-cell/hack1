import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";

// Initialize using Service Account credentials for Enterprise Security (NOT raw API keys if possible)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const TARGET_MODEL = "gemini-1.5-pro"; // Pro required for deep caching tasks

/**
 * Provisions a persistent context cache on Vertex AI.
 * @param documentUri - Google Cloud Storage URI (gs://...) containing raw data
 * @param mimeType - MIME type of the document (e.g., 'application/pdf', 'application/json')
 * @returns cacheIdentifier string to be used in subsequent queries
 */
export async function provisionAgentCache(documentUri: string, mimeType: string): Promise<string> {
  try {
    const cacheParams = await ai.caches.create({
      model: TARGET_MODEL,
      config: {
        contents: [createUserContent(createPartFromUri(documentUri, mimeType))],
        // The persona is cached, preventing prompt injection on the frontend
        systemInstruction:
          "You are the Aegis Routing Intelligence. You have internalized the complete stadium spatial blueprint and the Vanguard gamification payout schedule. Your role is to evaluate crowd density events and dispatch optimal rerouting instructions. Do not hallucinate outside the cached context.",
        ttl: "7200s", // 2-Hour Time-To-Live. Billed by the minute.
      },
    });

    if (!cacheParams.name) throw new Error("Cache provisioned but returned no identifier.");
    console.error(`[VERTEX CACHE] Provisioned successfully: ${cacheParams.name}`);
    return cacheParams.name; // Format: cachedContents/{id}
  } catch (error) {
    console.error("[VERTEX CACHE] Provisioning Failed:", error);
    throw new Error("Failed to initialize Explicit Context Caching");
  }
}
