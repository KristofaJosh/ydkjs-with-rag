from chromadb import PersistentClient  # This is for development purposes only.
from langchain_chroma import Chroma
from configs.llm import embedder

chroma_client = PersistentClient(path="./chroma_db")


collection_name = "ydkjs_collection"

retriever = Chroma(
    collection_name=collection_name, embedding_function=embedder, client=chroma_client
).as_retriever()
