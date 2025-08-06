import ast
import json
from langchain.schema.document import Document

from langchain_text_splitters import MarkdownHeaderTextSplitter

from configs.llm import chat_llm
from module.book.cache import update_cache, get_cached_record
from module.book.types import GitHubFileItem
from module.llm.types import ReadingOrder
from prompts.get_recommended_books_in_order import get_recommended_books_in_order
from utils.remove_html_contents import remove_html_contents


def analyze_intro_readme(
    readme: str, contents: list[GitHubFileItem], sha: str
) -> ReadingOrder:
    """
    Analyzes the README content to recommend books in order.
    :param readme:
    :param contents:
    :param sha:
    :return:
    """
    from langchain_core.messages import HumanMessage

    readme = remove_html_contents(readme)

    # if sha exist, then return cached llm response
    current_sha = f"ai-{sha}"
    cached_row = get_cached_record(current_sha)

    if cached_row and cached_row[1] == current_sha:
        _, _, content, _ = cached_row
        return json.loads(content)

    prompt = get_recommended_books_in_order(readme=readme, file_contents=contents)

    raw_response = chat_llm.invoke(
       prompt
    ).content

    clean_response = (
        raw_response.strip().removeprefix("```python").removesuffix("```").strip()
    )

    try:
        result = ast.literal_eval(clean_response)
    except (SyntaxError, ValueError) as e:
        raise ValueError("Failed to parse LLM response as a dictionary") from e

    update_cache(current_sha, json.dumps(result))
    return result


def split_document_into_chunks(
    document: str, chunk_size: int = 800, overlap: int = 100
) -> list[Document]:
    """
    Splits a document into chunks of specified size with overlap.

    Args:
        document (str): The document to split.
        chunk_size (int): The size of each chunk.
        overlap (int): The number of characters to overlap between chunks.

    Returns:
        list[str]: A list of document chunks.
    """
    # chunks = []
    # start = 0
    #
    # while start < len(document):
    #     end = start + chunk_size
    #     chunk = document[start:end]
    #     chunks.append(chunk)
    #     start += chunk_size - overlap  # Move the start forward by chunk_size - overlap
    #
    # return chunks

    from langchain.text_splitter import RecursiveCharacterTextSplitter

    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[("#", "h1"), ("##", "h2"), ("###", "h3"), ("###", "h4")]
    )

    markdown_sections: list[Document] = markdown_splitter.split_text(document)

    # Further split each section into overlapping chunks
    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=overlap, length_function=len
    )

    final_docs: list[Document] = []

    for section in markdown_sections:
        sub_docs = recursive_splitter.split_documents([section])
        final_docs.extend(sub_docs)

    return final_docs


def store_embeddings(docs: list[Document]):
    from configs.chroma_db import chroma_client, collection_name
    from configs.llm import embedder
    from langchain_chroma import Chroma

    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embedder,
        collection_name=collection_name,
        client=chroma_client,
    )
    return vectorstore.as_retriever()
