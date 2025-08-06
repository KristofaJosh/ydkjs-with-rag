"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  X,
  Send,
  Bot,
  User,
} from "lucide-react";

interface BookReaderProps {
  bookId: string;
  selectedChapter: string | null;
  onChapterSelect: (chapterId: string) => void;
  onStartChat: () => void;
}

const bookContent = {
  "get-started": {
    title: "Get Started",
    accentColor: "green",
    chapters: [
      {
        id: "ch1",
        title: "What Is JavaScript?",
        content:
          "JavaScript is one of the most ubiquitous programming languages in the world...",
        completed: false,
      },
      {
        id: "ch2",
        title: "Surveying JS",
        content: "The best way to learn JS is to start writing JS...",
        completed: false,
      },
      {
        id: "ch3",
        title: "Digging to the Roots of JS",
        content:
          "If you've read Chapters 1 and 2, and practiced some of the code...",
        completed: false,
      },
    ],
  },
};

export function BookReader({
  bookId,
  selectedChapter,
  onChapterSelect,
}: BookReaderProps) {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai" as const,
      content: `Hi! I'm here to help you understand this chapter. Feel free to ask me anything about the concepts, code examples, or exercises.`,
      timestamp: new Date(),
    },
  ]);

  const book = bookContent[bookId as keyof typeof bookContent];
  const currentChapter =
    book?.chapters.find((ch) => ch.id === selectedChapter) || book?.chapters[0];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai" as const,
        content: `Great question about "${currentChapter?.title}"! Let me explain that concept in detail...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const navigateToChat = () => {
    if (selectedChapter) {
      router.push(`/chat/chapter/${bookId}/${selectedChapter}`);
    } else {
      router.push(`/chat/book/${bookId}`);
    }
  };

  if (!book) return <div>Book not found</div>;

  // Find the index of the current chapter
  const currentChapterIndex = book.chapters.findIndex(
    (ch) => ch.id === currentChapter?.id
  );
  
  // Determine previous and next chapters
  const prevChapter = currentChapterIndex > 0 
    ? book.chapters[currentChapterIndex - 1] 
    : null;
    
  const nextChapter = currentChapterIndex < book.chapters.length - 1 
    ? book.chapters[currentChapterIndex + 1] 
    : null;

  return (
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className={`transition-all duration-300 ${isChatOpen ? "mr-96" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 neomorphic-container">
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-6 flex items-center neomorphic-text-title">
                    <div className="neomorphic-1 p-2 rounded-xl mr-3 relative">
                      <BookOpen className="w-5 h-5 neomorphic-text" />
                      <span className={`accent-dot accent-dot-${book.accentColor} absolute -top-1 -right-1`}></span>
                    </div>
                    {book.title}
                  </h3>
                  <div className="space-y-3">
                    {book.chapters.map((chapter, index) => (
                        <button
                            key={chapter.id}
                            onClick={() => onChapterSelect(chapter.id)}
                            className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between ${
                                currentChapter?.id === chapter.id ? "neomorphic-button-active" : "neomorphic-button"
                            }`}
                        >
                          <div>
                            <div className="font-medium text-sm">{chapter.title}</div>
                            <div className="text-xs neomorphic-text mt-1">Chapter {index + 1}</div>
                          </div>
                          {chapter.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </button>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-6">
                    <div className="progress-bar">
                      <div className={`progress-fill progress-fill-${book.accentColor}`} style={{ width: "0%" }}></div>
                    </div>
                    <p className="text-xs neomorphic-text mt-2 text-center">0% Complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="neomorphic-container h-[calc(100dvh-160px)]">
                <div className="p-8 grid h-full grid-rows-[1fr_auto] gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className={`neomorphic-badge-${book.accentColor} mb-3 font-medium`}>
                          Chapter {book.chapters.findIndex((ch) => ch.id === currentChapter?.id) + 1}
                        </div>
                        <h1 className="text-4xl font-bold neomorphic-text-title mb-2">{currentChapter?.title}</h1>
                      </div>
                      <button
                          onClick={handleChatToggle}
                          className={`neomorphic-button p-4 rounded-2xl ${isChatOpen ? "neomorphic-button-active" : ""}`}
                          title={isChatOpen ? "Close chat" : "Chat about this chapter"}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="prose prose-lg max-w-none">
                      <div className="neomorphic-inset-2 rounded-3xl p-8 mb-8 relative">
                        <span className={`accent-dot accent-dot-${book.accentColor} absolute top-4 right-4`}></span>
                        <p className="neomorphic-text-dark leading-relaxed text-lg">{currentChapter?.content}</p>
                      </div>

                      <div className="space-y-8 neomorphic-text">
                        <p className="leading-relaxed">
                          This is where the actual chapter content would be rendered. The content would be parsed from the
                          markdown files in the GitHub repository and displayed with proper formatting, code highlighting,
                          and interactive elements.
                        </p>

                        <div className="neomorphic-inset-2 rounded-3xl p-6 relative" style={{ background: "#2d3748" }}>
                          <span className="accent-dot accent-dot-green absolute top-4 right-4"></span>
                          <div className="text-green-300 font-mono text-sm">
                            <div className="text-slate-400 mb-2">// Example JavaScript code</div>
                            <div>{"function greet(name) {"}</div>
                            <div className="ml-4">{"return `Hello, ${name}!`;"}</div>
                            <div>{"}"}</div>
                          </div>
                        </div>

                        <p className="leading-relaxed">
                          Each chapter would include interactive code examples, exercises, and the ability to chat with AI
                          about specific concepts or code snippets.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-12 pt-8">
                    <button className="neomorphic-button flex items-center space-x-2">
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous Chapter</span>
                    </button>
                    <button className="neomorphic-button flex items-center space-x-2">
                      <span>Next Chapter</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div
            className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-96 transform transition-transform duration-300 z-40 ${
                isChatOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="neomorphic-container h-full flex flex-col m-6">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-300/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="neomorphic-1 p-2 rounded-xl relative">
                  <Bot className="w-5 h-5 neomorphic-text" />
                  <span className={`accent-dot accent-dot-${book.accentColor} absolute -top-1 -right-1`}></span>
                </div>
                <div>
                  <h3 className="font-semibold neomorphic-text-title">Chapter Assistant</h3>
                  <p className="text-sm neomorphic-text">{currentChapter?.title}</p>
                </div>
              </div>
              <button onClick={handleChatToggle} className="neomorphic-button p-2 rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex items-start space-x-2 max-w-[85%]">
                        {msg.type === "ai" && (
                            <div className="neomorphic-1 p-1.5 rounded-lg flex-shrink-0">
                              <Bot className="w-3 h-3 neomorphic-text" />
                            </div>
                        )}
                        <div
                            className={`p-4 rounded-2xl text-sm ${
                                msg.type === "user" ? "neomorphic-inset-1" : "neomorphic-2"
                            }`}
                        >
                          <p className="leading-relaxed neomorphic-text-dark">{msg.content}</p>
                          <p className="text-xs mt-2 neomorphic-text">{msg.timestamp.toLocaleTimeString()}</p>
                        </div>
                        {msg.type === "user" && (
                            <div className="neomorphic-1 p-1.5 rounded-lg flex-shrink-0">
                              <User className="w-3 h-3 neomorphic-text" />
                            </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-300/30">
              <div className="flex space-x-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about this chapter..."
                    className="flex-1 neomorphic-input text-sm py-3 px-4"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="neomorphic-button px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <Send className="w-4 h-4" />
                  {message.trim() && (
                      <span className={`accent-dot accent-dot-${book.accentColor} absolute -top-1 -right-1`}></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}