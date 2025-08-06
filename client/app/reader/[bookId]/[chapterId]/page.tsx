"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { Navigation } from "@/components/navigation";
import { useBookStore } from "@/store/bookStore";

export default function ChapterPage() {
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
        <BookReader
          bookId={bookId}
          selectedChapter={chapterId}
          onChapterSelect={setSelectedChapter}
          onStartChat={() => {
            // This will be handled by navigation
          }}
        />
      </main>
    </div>
  );
}