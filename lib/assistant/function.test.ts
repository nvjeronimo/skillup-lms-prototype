import { afterEach, describe, expect, it } from "vitest";
import { GET, POST } from "../../api/assistant";

/**
 * The Vercel Function (api/assistant.ts) without a key. The chat starts in script mode and
 * only switches when GET says `model`, so a deployment with no ANTHROPIC_API_KEY never calls
 * the model. POST stays a 503 so a stray call cannot become a proxy.
 */
const savedKey = process.env.ANTHROPIC_API_KEY;

afterEach(() => {
  if (savedKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = savedKey;
});

describe("api/assistant without a key", () => {
  it("GET reports script mode", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/json/);
    expect(await response.json()).toEqual({ mode: "script" });
  });

  it("POST refuses before it reads the body", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const response = await POST(
      new Request("http://localhost/api/assistant", { method: "POST", body: "not json" }),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).toBe("The assistant has no model configured.");
  });
});

describe("api/assistant with a key", () => {
  it("GET reports model mode", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key-not-used";
    const response = GET();
    expect(await response.json()).toEqual({ mode: "model" });
  });

  it("POST rejects a body that is not JSON", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key-not-used";
    const response = await POST(
      new Request("http://localhost/api/assistant", { method: "POST", body: "not json" }),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("The request is not JSON.");
  });
});
