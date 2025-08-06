import json
import asyncio

from module.book.cache import update_cache, get_cached_record
from module.llm.helpers import analyze_intro_readme
from module.book.helpers import (
    get_repo_contents,
    get_readme_content,
    get_repo_book_contents,
)
from utils.translate_base64_content_To_text import translate_base64_content_to_text


async def get_books():
    contents = await asyncio.to_thread(get_repo_contents)
    readme, sha = await asyncio.to_thread(get_readme_content, contents)

    if readme:
        result = await asyncio.to_thread(analyze_intro_readme, readme, contents, sha)
        books = list(result.items())

        async def process_book(k, v):
            """
            Process a single book: retrieve from cache if possible, otherwise fetch and cache.
            Accumulates all pages for the book.
            """
            current_sha = f'book-{v["sha"]}'
            # Try to get the whole book from cache
            cached_row = await asyncio.to_thread(get_cached_record, current_sha)
            if cached_row:
                # Decode and parse the cached book content
                cached_json = cached_row[2]
                parsed_content = json.loads(cached_json)
                pages = parsed_content.get("tree", [])

                book_pages = []
                # Loop through all pages and accumulate their content
                for page in pages:
                    page_sha = f'page-{page["sha"]}'
                    try:
                        # Check if the individual page is cached
                        cached_page_row = await asyncio.to_thread(
                            get_cached_record, page_sha
                        )

                        if cached_page_row:
                            # Use cached page content
                            cached_page_json = cached_page_row[2]
                            parsed_page_row = json.loads(cached_page_json)
                            content = parsed_page_row.get("content", "")
                        else:
                            # If not cached, fetch and cache it
                            try:
                                content = await asyncio.to_thread(
                                    get_repo_book_contents,
                                    page["url"],
                                )
                            except Exception as e:
                                print(f"Error fetching {page['url']}: {e}")
                                continue
                            # Await the cache update in a thread for IO
                            if not content:
                                continue
                            await asyncio.to_thread(
                                update_cache,
                                page_sha,
                                json.dumps(
                                    {
                                        **page,
                                        "content": translate_base64_content_to_text(
                                            content["content"]
                                        ),
                                    }
                                ),
                            )

                        book_pages.append({**page, "content": content})
                    except Exception as e:
                        print(f"Error processing {page_sha}: {e}")
                        continue

                # Return the book with all accumulated pages
                return {"name": k, "pages": book_pages}

            # If book is not cached at all, fetch and cache it
            book = await asyncio.to_thread(get_repo_book_contents, v["url"])
            book = {**book, "name": k}
            # Translate the base64 content to text
            book_content = await asyncio.to_thread(
                translate_base64_content_to_text, book["content"]
            )
            book = {**book, "content": book_content, "tree": contents}
            # Cache the book content
            await asyncio.to_thread(update_cache, current_sha, json.dumps(book))
            return book

        tasks = [process_book(k, v) for k, v in books]
        data = await asyncio.gather(*tasks)
        return data
    return None


def get_books_by_sha(sha: str):
    """
    Get books by SHA.
    :param sha: The SHA of the book.
    :return: A dictionary of books with their reading order.
    """
    contents = get_repo_contents()
    readme, _ = get_readme_content(contents)

    if readme:
        result = analyze_intro_readme(readme, contents, sha)
        return result
    return {}
