import { BookLibrary } from "@/components/book-library";
import { Navigation } from "@/components/navigation";

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--neomorphic-bg)" }}
    >
      <Navigation />
      
      <main className="pt-28">
        <BookLibrary />
      </main>
    </div>
  );
}