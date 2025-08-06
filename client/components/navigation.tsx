"use client";

import { BookOpen, Library, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBookStore } from "@/store/bookStore";

const bookColors: Record<string, string> = {
  "get-started": "green",
  "scope-closures": "blue",
  "objects-classes": "purple",
  "types-grammar": "orange",
  "sync-async": "pink",
  "es-next-beyond": "indigo",
};

export function Navigation() {
  const pathname = usePathname();
  const { selectedBook, selectedChapter } = useBookStore();
  
  const isLibraryActive = pathname === "/";
  const isReaderActive = pathname.startsWith("/reader");
  const isChatActive = pathname.startsWith("/chat");
  
  const bookColor = selectedBook ? bookColors[selectedBook] : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 neomorphic-nav">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <div className="neomorphic-2 w-12 h-12 rounded-2xl flex items-center justify-center relative">
              <BookOpen className="w-6 h-6 neomorphic-text" />
            </div>
            <div>
              <h1 className="text-xl font-bold neomorphic-text-title">
                You Don't Know JS
              </h1>
              <p className="text-sm neomorphic-text">
                Interactive Learning Platform
              </p>
            </div>
          </Link>

          <div className="neomorphic-inset-1 rounded-3xl p-2 flex items-center space-x-1">
            <Link
              href="/"
              className={`px-6 py-3 rounded-2xl transition-all duration-200 flex items-center space-x-2 ${
                isLibraryActive
                  ? "neomorphic-button-active"
                  : "neomorphic-button"
              }`}
            >
              <Library className="w-4 h-4" />
              <span className="font-medium">Library</span>
            </Link>
            <Link
              href={selectedBook ? `/reader/${selectedBook}` : "#"}
              className={`px-6 py-3 rounded-2xl transition-all duration-200 flex items-center space-x-2 ${
                !selectedBook ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isReaderActive
                  ? "neomorphic-button-active"
                  : "neomorphic-button"
              }`}
              onClick={(e) => {
                if (!selectedBook) e.preventDefault();
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Read</span>
            </Link>
            <Link
              href="/chat"
              className={`px-6 py-3 rounded-2xl transition-all duration-200 flex items-center space-x-2 ${
                isChatActive
                  ? "neomorphic-button-active"
                  : "neomorphic-button"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">AI Chat</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}