import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data) {
    return new Response("Missing question parameter", { status: 400 });
  }

  // const backendRes = await fetch("http://localhost:8000/ask", {
  const backendRes = await fetch("http://ydkjs-reader:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!backendRes.body) {
    return new Response("No response body from backend", { status: 500 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = backendRes.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(decoder.decode(value));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}
