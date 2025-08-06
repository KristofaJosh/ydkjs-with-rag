"use client";

import {
  BookOpen,
  Clock,
  Users,
  Code,
  Zap,
  Layers,
  Settings,
  Cpu,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useBookStore } from "@/store/bookStore";

const books = [
  {
    id: "get-started",
    title: "Get Started",
    description:
      "Your journey into programming starts here. Learn the fundamentals of JavaScript and programming concepts.",
    chapters: 12,
    readTime: "3-4 hours",
    difficulty: "Beginner",
    elevation: "neomorphic-card-low",
    icon: Code,
    accentColor: "green",
    badgeClass: "neomorphic-badge-green",
    progress: 0,
  },
  {
    id: "scope-closures",
    title: "Scope & Closures",
    description:
      "Deep dive into JavaScript's scope system and the powerful concept of closures.",
    chapters: 8,
    readTime: "4-5 hours",
    difficulty: "Intermediate",
    elevation: "neomorphic-card-medium",
    icon: Layers,
    accentColor: "blue",
    badgeClass: "neomorphic-badge-blue",
    progress: 0,
  },
  {
    id: "objects-classes",
    title: "Objects & Classes",
    description:
      "Master object-oriented programming in JavaScript with prototypes and modern class syntax.",
    chapters: 10,
    readTime: "5-6 hours",
    difficulty: "Intermediate",
    elevation: "neomorphic-card-low",
    icon: Settings,
    accentColor: "purple",
    badgeClass: "neomorphic-badge-purple",
    progress: 0,
  },
  {
    id: "types-grammar",
    title: "Types & Grammar",
    description:
      "Understand JavaScript's type system, coercion, and the intricacies of the language grammar.",
    chapters: 9,
    readTime: "4-5 hours",
    difficulty: "Advanced",
    elevation: "neomorphic-card-high",
    icon: Cpu,
    accentColor: "orange",
    badgeClass: "neomorphic-badge-orange",
    progress: 0,
  },
  {
    id: "sync-async",
    title: "Sync & Async",
    description:
      "Learn asynchronous programming patterns, promises, async/await, and event loops.",
    chapters: 11,
    readTime: "6-7 hours",
    difficulty: "Advanced",
    elevation: "neomorphic-card-medium",
    icon: Zap,
    accentColor: "pink",
    badgeClass: "neomorphic-badge-pink",
    progress: 0,
  },
  {
    id: "es-next-beyond",
    title: "ES.Next & Beyond",
    description:
      "Explore the latest JavaScript features and what's coming next in the language.",
    chapters: 7,
    readTime: "3-4 hours",
    difficulty: "Advanced",
    elevation: "neomorphic-card-low",
    icon: Sparkles,
    accentColor: "indigo",
    badgeClass: "neomorphic-badge-indigo",
    progress: 0,
  },
];

export function BookLibrary() {
  const { setSelectedBook } = useBookStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <span className="accent-dot accent-dot-orange mr-3"></span>
          <span className="accent-dot accent-dot-blue mr-3"></span>
          <span className="accent-dot accent-dot-purple mr-3"></span>
          <span className="accent-dot accent-dot-green"></span>
        </div>
        <h1 className="text-5xl font-bold neomorphic-text-title mb-6">
          Master JavaScript
        </h1>
        <p className="text-xl neomorphic-text max-w-3xl mx-auto leading-relaxed">
          Dive deep into JavaScript with Kyle Simpson's comprehensive book
          series. Read, learn, and chat with AI to master every concept.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, index) => {
          const IconComponent = book.icon;
          return (
            <Link
              key={book.id}
              href={`/reader/${book.id}`}
              className={`${book.elevation} cursor-pointer transition-all duration-300`}
              onClick={() => setSelectedBook(book.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-8">
                <div className="neomorphic-inset-1 rounded-3xl p-6 mb-6 text-center relative">
                  <div className="neomorphic-2 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 neomorphic-text" />
                  </div>
                  <h3 className="neomorphic-text-title font-bold text-2xl mb-3">
                    {book.title}
                  </h3>
                  <span className={`${book.badgeClass} font-medium`}>
                    {book.difficulty}
                  </span>

                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill progress-fill-${book.accentColor}`}
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs neomorphic-text mt-2">
                      {book.progress}% Complete
                    </p>
                  </div>
                </div>

                <p className="neomorphic-text leading-relaxed mb-6 text-center">
                  {book.description}
                </p>

                <div className="flex items-center justify-between neomorphic-text text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.chapters} chapters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{book.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link href="/chat" className="neomorphic-card-medium inline-block p-8">
          <div className="flex items-center space-x-4">
            <div className="neomorphic-2 p-4 rounded-2xl relative">
              <Users className="w-8 h-8 neomorphic-text" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold neomorphic-text-title text-lg">
                Global AI Chat
              </h4>
              <p className="neomorphic-text">
                Chat about any JavaScript topic across all books
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}