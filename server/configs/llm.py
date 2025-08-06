from langchain_ollama.embeddings import OllamaEmbeddings
from langchain_ollama import ChatOllama

embedder = OllamaEmbeddings(model="nomic-embed-text")

chat_llm = ChatOllama(
    model="gemma3:4b",  # llama3.2
    temperature=0,  # for deterministic output 0 ~ 1.0 creative output
    top_p=1,  # a.k.a. nucleus sampling, focus level 0.2 ~ diverse 1.0
    top_k=0,  # most likely next tokens., 40 is a good value for most tasks
)
