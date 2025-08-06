import asyncio
from http.client import responses

from dotenv import load_dotenv
from fastapi import FastAPI, Body
from starlette.responses import StreamingResponse
from pydantic import BaseModel

from configs.chroma_db import retriever
from configs.llm import chat_llm
from module.llm.helpers import split_document_into_chunks, store_embeddings
from prompts.doc_assistant import build_assistant_prompt

load_dotenv()

from module.book.cache import init_cache_db
from module.book.controller import get_books

app = FastAPI()

class Data(BaseModel):
    question: str
    history: list[str] = []

class AskRequest(BaseModel):
    data: Data

def ask_with_streaming(question: str):
    docs = retriever.invoke(question)
    context = "\n\n".join([doc.page_content for doc in docs])
    prompt = build_assistant_prompt(question, context)
    for chunk in chat_llm.stream(prompt):
        # print(chunk.content, end="", flush=True)
        yield chunk.content


# Define the retrieval + LLM chain
def ask_question(question: str):
    docs = retriever.invoke(question)
    context = "\n\n".join([doc.page_content for doc in docs])
    prompt = build_assistant_prompt(question, context)
    return chat_llm.invoke(prompt).content


async def init_chroma():
    books = await get_books()
    full_content = ""
    for book in books:
        for page in book["pages"]:
            full_content += f"\n\n-----\n\n{page['content']}"
    chunks = split_document_into_chunks(full_content)
    store_embeddings(chunks)


# response = ask_question("How does JavaScript's event loop work?")
# print(response)
# ask_with_streaming("how can I ensure an object is immutable")

@app.get("/")
def hello(request = Body(...)) -> dict[str, str]:
    return { "message": "Hello, World!" }

@app.post("/ask")
def ask(request = Body(...)) -> StreamingResponse:
    data = request.get("data", {})
    question = data.get("question", "")
    history = data.get("history", [])

    # question = request.data.question
    # history = request.data.history
    response = ask_with_streaming(question)
    print(response)
    return StreamingResponse(response, media_type="text/plain")
#

if __name__ == "__main__":
    init_cache_db()
    asyncio.run(init_chroma())
