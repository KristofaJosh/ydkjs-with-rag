"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { Navigation } from "@/components/navigation";
import { useBookStore } from "@/store/bookStore";

export default function BookChatPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const { setSelectedBook } = useBookStore();
  
  // Update the store when the page loads
  useEffect(() => {
    setSelectedBook(bookId);
  }, [bookId, setSelectedBook]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--neomorphic-bg)" }}
    >
      <Navigation />
      
      <main className="pt-20">
        <ChatInterface
          context="book"
          bookId={bookId}
          chapterId={null}
        />
      </main>
    </div>
  );
}