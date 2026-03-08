import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CLAUDE_BIN = "/Users/skakovsi/.local/bin/claude";
const KNOWLEDGE_PATH = path.join(process.cwd(), "data/guide-knowledge.md");

// Cache knowledge at module level
let guideKnowledge: string | null = null;
function getGuideKnowledge(): string {
  if (!guideKnowledge) {
    guideKnowledge = fs.readFileSync(KNOWLEDGE_PATH, "utf-8");
  }
  return guideKnowledge;
}

const SYSTEM_PROMPT_PREFIX = `Ты — AI-ассистент косметолога Кристины (@kristar.kristina).
Отвечай на вопросы о макияже ТОЛЬКО на основе информации из гайда ниже.
Если вопрос выходит за рамки гайда — скажи об этом вежливо.
Отвечай на русском языке. Будь конкретной и полезной.

--- ГАЙД ---
`;

const SYSTEM_PROMPT_SUFFIX = `
--- КОНЕЦ ГАЙДА ---

После каждого ответа добавляй в самом конце блок с возможными уточняющими вопросами:
[FOLLOWUPS]
["Вопрос 1?", "Вопрос 2?", "Вопрос 3?", "Вопрос 4?", "Вопрос 5?"]
[/FOLLOWUPS]
Вопросы должны быть краткими (до 8 слов), конкретными и логически вытекать из разговора. Это обязательный формат — всегда включай этот блок.`;

type Message = { role: "user" | "assistant"; content: string };

function buildStreamJsonInput(messages: Message[]): string {
  const guide = getGuideKnowledge();

  // Build a single self-contained user message with guide + full conversation history.
  // This is more reliable than multi-turn stream-json since the CLI always has
  // the full context regardless of how many turns have happened.
  let content = SYSTEM_PROMPT_PREFIX + guide + SYSTEM_PROMPT_SUFFIX;

  if (messages.length === 1) {
    content += "\n\nВопрос пользователя: " + messages[0].content;
  } else {
    content += "\n\nИстория разговора:\n";
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      const label = msg.role === "user" ? "Пользователь" : "Ассистент";
      content += `${label}: ${msg.content}\n\n`;
    }
    content += "Текущий вопрос пользователя: " + messages[messages.length - 1].content;
  }

  return JSON.stringify({
    type: "user",
    message: { role: "user", content: [{ type: "text", text: content }] },
  });
}

function parseStreamJsonResponse(raw: string): string {
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      if (obj.type === "assistant") {
        const content = obj.message?.content ?? [];
        const texts = content.filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text);
        if (texts.length > 0) return texts.join("\n");
      }
    } catch {
      // skip non-JSON lines
    }
  }
  return "[ответ не получен]";
}

// Env without CLAUDE* vars that block nested execution
function getCleanEnv(): Record<string, string | undefined> {
  const blocked = new Set(["CLAUDECODE", "CLAUDE_CODE_SSE_PORT", "CLAUDE_CODE_ENTRYPOINT"]);
  const env: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (!blocked.has(k)) env[k] = v;
  }
  return env;
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const { messages } = body as { messages: Message[] };

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const input = buildStreamJsonInput(messages);

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const proc = spawn(
      CLAUDE_BIN,
      ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose"],
      { env: getCleanEnv() as NodeJS.ProcessEnv }
    );

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill();
      resolve(NextResponse.json({ error: "timeout" }, { status: 504 }));
    }, 60_000);

    proc.stdin.write(input);
    proc.stdin.end();

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) return;
      if (code !== 0) {
        resolve(NextResponse.json({ error: stderr.trim() || `exit ${code}` }, { status: 500 }));
        return;
      }
      const reply = parseStreamJsonResponse(stdout);
      resolve(NextResponse.json({ reply }));
    });
  });
}
