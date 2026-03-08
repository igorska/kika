import ChatInterface from "@/components/ChatInterface";

export const metadata = { title: "Чат с гайдом" };

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[100dvh] bg-cream">
      <header className="shrink-0 border-b border-primary-light px-4 py-4 bg-cream">
        <h1 className="font-serif text-2xl text-charcoal text-center">Чат с гайдом</h1>
        <p className="text-center text-xs text-charcoal/50 mt-1">
          Задай вопрос по гайду «Как собрать идеальную косметичку»
        </p>
      </header>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
