"use client";

import {cn} from "@/lib/utils";
import {
  BookOpen,
  Bot,
  Lightbulb,
  MessageCircle,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useState, useRef } from "react";

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypePrism from 'rehype-prism-plus'
import 'highlight.js/styles/github.css' // or any other theme

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

// you have to load css manual
import "prismjs/themes/prism-coy.css";
// import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface ChatInterfaceProps {
  context: "chapter" | "book" | "global";
  bookId: string | null;
  chapterId: string | null;
}

export function ChatInterface({
  context,
  bookId,
  chapterId,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai" as const,
      content:
        "Hi! I'm your JavaScript learning assistant. I can help you understand concepts, explain code, and answer questions about the \"You Don't Know JS\" series. What would you like to learn about?",
      timestamp: new Date(),
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const handleAsk = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: message,
        history: messages.map(({ type, content }) => ({
          role: type === "user" ? "user" : "assistant",
          content,
        })),
      }),
    });

    if (!response.body) {
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let aiContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      aiContent += decoder.decode(value);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.type === "ai" && last.content !== aiContent) {
          // Update existing AI message
          return [
            ...prev.slice(0, -1),
            { ...last, content: aiContent },
          ];
        }
        // Append new AI message
        return [
          ...prev,
          {
            id: prev.length + 1,
            type: "ai" as const,
            content: aiContent,
            timestamp: new Date(),
          },
        ];
      });
      if (!userScrolledUp) {
        setTimeout(() => {
          chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
        }, 0);
      }
    }

    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    handleAsk();

    // setTimeout(() => {
    //   const aiResponse = {
    //     id: messages.length + 2,
    //     type: "ai" as const,
    //     content: "That's a great question! Let me explain that concept in detail...",
    //     timestamp: new Date(),
    //   }
    //   setMessages((prev) => [...prev, aiResponse])
    // }, 1000)
  };

  const getContextInfo = () => {
    switch (context) {
      case "chapter":
        return { icon: BookOpen, label: "Chapter Chat", color: "blue" };
      case "book":
        return { icon: MessageCircle, label: "Book Chat", color: "purple" };
      case "global":
        return { icon: Sparkles, label: "Global Chat", color: "orange" };
    }
  };

  const contextInfo = getContextInfo();
  const ContextIcon = contextInfo.icon;

  const suggestedQuestions = [
    "What are closures and how do they work?",
    "Explain the difference between var, let, and const",
    "How does JavaScript's event loop work?",
    "What is the 'this' keyword in JavaScript?",
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chat Context & Suggestions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="neomorphic-container">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="neomorphic-2 p-3 rounded-2xl relative">
                  <ContextIcon className="w-6 h-6 neomorphic-text" />
                  <span
                    className={`accent-dot accent-dot-${contextInfo.color} absolute -top-1 -right-1`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-semibold neomorphic-text-title">
                    {contextInfo.label}
                  </h3>
                  <p className="text-sm neomorphic-text">
                    {context === "chapter" &&
                      chapterId &&
                      `Chapter: ${chapterId}`}
                    {context === "book" && bookId && `Book: ${bookId}`}
                    {context === "global" && "All books & topics"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="neomorphic-container">
            <div className="p-6">
              <h4 className="font-semibold flex items-center neomorphic-text-title mb-4">
                <div className="neomorphic-1 p-2 rounded-xl mr-3 relative">
                  <Lightbulb className="w-4 h-4 neomorphic-text" />
                  <span className="accent-dot accent-dot-green absolute -top-1 -right-1"></span>
                </div>
                Suggested Questions
              </h4>
              <div className="space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(question)}
                    className="w-full text-left p-4 text-sm neomorphic-button rounded-2xl transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <div className="neomorphic-container h-[calc(100dvh-160px)] flex flex-col">
            <div className="p-6 border-b border-gray-300/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="neomorphic-1 p-2 rounded-xl relative">
                    <Bot className="w-5 h-5 neomorphic-text" />
                    <span className="accent-dot accent-dot-green absolute -top-1 -right-1"></span>
                  </div>
                  <h2 className="text-xl font-bold neomorphic-text-title">
                    AI Learning Assistant
                  </h2>
                </div>
                <div className="neomorphic-badge-green font-medium">Online</div>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6"
              ref={chatContainerRef}
              onScroll={(e) => {
                const target = e.currentTarget;
                const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 20;
                setUserScrolledUp(!atBottom);
              }}
            >
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start space-x-3 max-w-[80%] whitespace-pre-wrap">
                      {msg.type === "ai" && (
                        <div className="neomorphic-1 p-2 rounded-xl flex-shrink-0">
                          <Bot className="w-4 h-4 neomorphic-text" />
                        </div>
                      )}
                      <div
                        className={`p-6 rounded-3xl ${msg.type === "user" ? "neomorphic-inset-1" : "neomorphic-2"}`}
                      >
                        <span className="leading-relaxed neomorphic-text-dark">
                          <MarkdownRenderer content={msg.content} />
                        </span>
                        <p className="text-xs mt-3 neomorphic-text">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {msg.type === "user" && (
                        <div className="neomorphic-1 p-2 rounded-xl flex-shrink-0">
                          <User className="w-4 h-4 neomorphic-text" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-300/30">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about JavaScript..."
                  className="flex-1 neomorphic-input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="neomorphic-button px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  <Send className="w-5 h-5" />
                  {message.trim() && (
                    <span className="accent-dot accent-dot-blue absolute -top-1 -right-1"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown components={{
        code: ({node, ...props}) =>  <code {...props} style={{...props.style, whiteSpace: "pre-wrap", }}/>,
        table: ({node, ...props}) => (
            <table className="table-auto border border-collapse border-gray-300 w-full" {...props} />
        ),
        th: ({node, ...props}) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props} />
        ),
        td: ({node, ...props}) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
        ),
      }} rehypePlugins={[rehypePrism, remarkParse, remarkRehype,rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}
