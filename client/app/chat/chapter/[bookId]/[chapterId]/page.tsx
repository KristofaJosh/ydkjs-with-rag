"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { Navigation } from "@/components/navigation";
import { useBookStore } from "@/store/bookStore";

export default function ChapterChatPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const chapterId = params.chapterId as string;
  const { setSelectedBook, setSelectedChapter } = useBookStore();
  
  // Update the store when the page loads
  useEffect(() => {
    setSelectedBook(bookId);
    setSelectedChapter(chapterId);
  }, [bookId, chapterId, setSelectedBook, setSelectedChapter]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--neomorphic-bg)" }}
    >
      <Navigation />
      
      <main className="pt-20">
        <ChatInterface
          context="chapter"
          bookId={bookId}
          chapterId={chapterId}
        />
      </main>
    </div>
  );
}