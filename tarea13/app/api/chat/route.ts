/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, createTextStreamResponse } from "ai";
import { tools } from "@/lib/tools";

const OPENROUTER_BASE =
  process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku";

if (!OPENROUTER_KEY) {
  console.warn("⚠️ OPENROUTER_API_KEY no encontrado en env");
}

// ----------------------
// RATE LIMITING
// ----------------------
const RATE_MAP = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

function getIP(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function sanitize(text: string) {
  return text
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .slice(0, 6000);
}

// ----------------------
// OPENROUTER CLIENT
// ----------------------
const aiClient = createOpenAI({
  apiKey: OPENROUTER_KEY,
  baseURL: OPENROUTER_BASE,
});

// ----------------------
// POST HANDLER
// ----------------------
export async function POST(req: NextRequest) {
  if (!OPENROUTER_KEY) {
    return NextResponse.json(
      { error: "Missing API key" },
      { status: 500 }
    );
  }

  // ---- rate limit ----
  const ip = getIP(req);
  const now = Date.now();
  const entry = RATE_MAP.get(ip) ?? { count: 0, ts: now };

  if (now - entry.ts > WINDOW_MS) {
    entry.count = 0;
    entry.ts = now;
  }

  entry.count++;
  RATE_MAP.set(ip, entry);

  if (entry.count > MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // ---- parse JSON ----
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.messages)) {
    return NextResponse.json(
      { error: "Messages must be an array" },
      { status: 400 }
    );
  }

  const messages = body.messages.map((m: any) => ({
    role:
      m.role === "user" ||
      m.role === "assistant" ||
      m.role === "system"
        ? m.role
        : "user",
    content: sanitize(String(m.content ?? "")),
  }));

  if (messages.length === 0 || !messages.at(-1)?.content) {
    return NextResponse.json(
      { error: "Empty message" },
      { status: 400 }
    );
  }

  try {
    // Tools → formato objeto
    const toolsObject = Object.fromEntries(
      tools.map((t: any) => [t.name, t])
    );

    const result = await streamText({
      model: aiClient(OPENROUTER_MODEL),
      messages,
      tools: toolsObject,
      toolChoice: "auto",
    });

    const response = createTextStreamResponse(result);
    response.headers.set(
      "Content-Type",
      "text/event-stream; charset=utf-8"
    );
    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (err: any) {
    console.error("❌ streamText error:", err);
    return NextResponse.json(
      { error: "AI stream error", detail: err.message },
      { status: 500 }
    );
  }
}
