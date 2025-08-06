import { ChatInterface } from "@/components/chat-interface";
import { Navigation } from "@/components/navigation";

export default function GlobalChatPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--neomorphic-bg)" }}
    >
      <Navigation />
      
      <main className="pt-20">
        <ChatInterface
          context="global"
          bookId={null}
          chapterId={null}
        />
      </main>
    </div>
  );
}