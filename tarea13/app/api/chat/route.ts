/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku";

if (!OPENROUTER_KEY) {
  console.warn("⚠️ OPENROUTER_API_KEY no encontrado en env");
}

const RATE_MAP = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 minuto
const MAX_PER_WINDOW = 30;


function ipFromReq(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}


function sanitizeInput(s: string) {
  return s
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .slice(0, 6000);
}

export async function POST(req: NextRequest) {
  if (!OPENROUTER_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: OpenRouter API key missing" },
      { status: 500 }
    );
  }

  const ip = ipFromReq(req);
  const now = Date.now();
  const entry = RATE_MAP.get(ip) ?? { count: 0, ts: now };

  if (now - entry.ts > WINDOW_MS) {
    entry.count = 0;
    entry.ts = now;
  }

  entry.count += 1;
  RATE_MAP.set(ip, entry);

  if (entry.count > MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages = rawMessages.map((m: any) => ({
    role: String(m.role || "user"),
    content: sanitizeInput(String(m.content || ""))
  }));

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const payload = {
    model: OPENROUTER_MODEL,
    messages: messages.map((m: any) => ({
      role: m.role,
      content: m.content
    })),
    stream: true
  };

  try {
    const upstream = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return NextResponse.json({ error: "Upstream error", detail: text }, { status: 502 });
    }

    const reader = upstream.body.getReader();

    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
        } catch (err) {
          controller.error(err);
        }
      },
      cancel() {
        try {
          reader.cancel();
        } catch {}
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store"
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", detail: String(err.message) },
      { status: 500 }
    );
  }
}
