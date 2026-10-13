import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/assistant/model-reply";
import { createRateLimiter } from "@/lib/assistant/rate-limit";
import { parseRequest } from "@/lib/assistant/request";

/**
 * The assistant with a model behind it. Used only when ANTHROPIC_API_KEY is set; without it
 * the chat answers from its script (lib/assistant/scripted) and never calls this.
 *
 * Dev notes:
 * - The snapshot comes from the browser because the prototype's progress lives in local
 *   storage. In the product the server builds it from the learner's session: a snapshot sent
 *   by the client must not be trusted.
 * - The limiter counts per serverless instance. The real ceiling is the spend limit set on
 *   the key in the Anthropic console (DEPLOY.md).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-sonnet-5-5";
// To the first byte from the API, and for the whole answer: a stream that stalls is cut.
const TIMEOUT_MS = 15_000;
const ANSWER_MS = 20_000;
// Thinking is always on for the default model and shares this ceiling with the answer; the
// answer itself is kept short by the prompt (90 words) and by `effort: "low"`.
const MAX_TOKENS = 1500;

const allow = createRateLimiter({ limit: 20, windowMs: 3_600_000 });

const plain = (message: string, status: number) => new Response(message, { status });

export function GET() {
  return Response.json({ mode: process.env.ANTHROPIC_API_KEY ? "model" : "script" });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return plain("The assistant has no model configured.", 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return plain("The request is not JSON.", 400);
  }
  const parsed = parseRequest(body);
  if (!parsed.ok) return plain(parsed.error, 400);
  const { turns, snapshot } = parsed;

  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(visitor)) return plain("Too many questions. Try again later.", 429);

  const client = new Anthropic({ maxRetries: 0 });
  const stream = client.messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low" },
      system: buildSystemPrompt(snapshot),
      messages: turns.map((m) => ({ role: m.role, content: m.text })),
    },
    { timeout: TIMEOUT_MS },
  );
  const deadline = setTimeout(() => stream.abort(), ANSWER_MS);
  request.signal.addEventListener("abort", () => stream.abort());

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          // A refusal or an empty reply ends the stream with no text; an API error breaks it.
          // Either way the browser answers that question from the script.
          controller.error(error);
        } finally {
          clearTimeout(deadline);
        }
      },
      cancel() {
        clearTimeout(deadline);
        stream.abort();
      },
    }),
    { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } },
  );
}
