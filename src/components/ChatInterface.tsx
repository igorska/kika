"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

function parseFollowups(raw: string): { text: string; followups: string[] } {
  const match = raw.match(/\[FOLLOWUPS\]([\s\S]*?)\[\/FOLLOWUPS\]/);
  if (!match) return { text: raw.trim(), followups: [] };
  try {
    const followups: string[] = JSON.parse(match[1].trim());
    const text = raw.replace(/\[FOLLOWUPS\][\s\S]*?\[\/FOLLOWUPS\]/, "").trim();
    return { text, followups };
  } catch {
    return { text: raw.replace(/\[FOLLOWUPS\][\s\S]*?\[\/FOLLOWUPS\]/, "").trim(), followups: [] };
  }
}

const STARTER_QUESTIONS = [
  "Какой тональный крем посоветуешь для жирной кожи?",
  "Как правильно наносить консилер?",
  "Какие кисти нужны для начинающих?",
  "Как выбрать румяна под тип кожи?",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      title="Копировать"
      // Always visible on touch devices; hover-reveal on desktop
      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-1 shrink-0 p-1 text-charcoal/40 hover:text-charcoal/70 touch-manipulation"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-500">
          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.175a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clipRule="evenodd" />
          <path d="M3 6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Z" />
        </svg>
      )}
    </button>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followups, setFollowups] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-grow textarea
  function adjustTextareaHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setFollowups([]);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const raw: string = data.reply ?? data.error ?? "Ошибка";
      const { text, followups: fqs } = parseFollowups(raw);
      // Store clean text in history (no [FOLLOWUPS] block)
      setMessages([...newMessages, { role: "assistant", content: text }]);
      setFollowups(fqs);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Произошла ошибка. Попробуйте ещё раз." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-center text-charcoal/60 text-sm">
              Задайте вопрос о гайде по макияжу
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-2 rounded-full border border-primary-light text-sm text-charcoal hover:bg-primary-light active:bg-primary-light transition-colors text-left touch-manipulation"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="group flex items-start gap-2 max-w-[90%] sm:max-w-[80%]">
                <Image
                  src="/author.jpg"
                  alt="Кристина"
                  width={32}
                  height={32}
                  className="rounded-full shrink-0 object-cover w-8 h-8 mt-1 border border-primary-light"
                />
                <div className="bg-white border border-primary-light text-charcoal rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic text-charcoal/70">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      hr: () => <hr className="my-3 border-primary-light" />,
                      h1: ({ children }) => <h1 className="font-semibold text-base mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="font-semibold mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="font-semibold mb-1">{children}</h3>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <CopyButton text={msg.content} />
              </div>
            )}

            {msg.role === "user" && (
              <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm max-w-[90%] sm:max-w-[80%] whitespace-pre-wrap">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {!loading && followups.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-10">
            {followups.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full border border-primary text-xs text-primary hover:bg-primary hover:text-white active:bg-primary active:text-white transition-colors text-left touch-manipulation"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-start items-start gap-2">
            <Image
              src="/author.jpg"
              alt="Кристина"
              width={32}
              height={32}
              className="rounded-full shrink-0 object-cover w-8 h-8 mt-1 border border-primary-light"
            />
            <div className="bg-white border border-primary-light text-charcoal rounded-2xl rounded-tl-sm px-4 py-4 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "160ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "320ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area — pb-safe for iPhone home bar */}
      <div
        className="border-t border-primary-light bg-cream px-3 sm:px-4 pt-3 pb-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); adjustTextareaHeight(); }}
            onKeyDown={handleKeyDown}
            placeholder="Задайте вопрос о гайде..."
            rows={1}
            // text-base (16px) prevents iOS auto-zoom on focus
            className="flex-1 resize-none rounded-xl border border-primary-light bg-white px-4 py-2.5 text-base sm:text-sm text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-primary transition-colors"
            style={{ maxHeight: "120px", overflowY: "auto" }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Отправить"
            className="bg-primary hover:bg-primary-dark active:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shrink-0 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5"
          >
            {/* Icon always visible; label hidden on mobile */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.903 6.557H13.5a.75.75 0 0 1 0 1.5H4.182l-1.903 6.557a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.208-8.718.75.75 0 0 0 0-1.076A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
            <span className="hidden sm:inline">Отправить</span>
          </button>
        </form>
        {/* Hint only on desktop */}
        <p className="hidden sm:block text-xs text-charcoal/40 mt-1">Enter — отправить, Shift+Enter — новая строка</p>
      </div>
    </div>
  );
}
