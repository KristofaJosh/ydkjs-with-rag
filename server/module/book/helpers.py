import os
from typing import Optional, Tuple

from utils.translate_base64_content_To_text import translate_base64_content_to_text
from module.book.cache import update_cache, get_cached_record
from module.book.types import GitHubFileItem, GitHubBookItem

ydkjs_base_repo_url = os.getenv("YDKJS_REPO_URL")


import requests


def get_readme_content(data: list[GitHubFileItem]) -> Optional[Tuple[str, str]]:
    # Find the README file from the list
    get_readme = lambda item: item["name"].lower() == "readme.md"
    match = next(filter(get_readme, data), None)
    if not match:
        raise ValueError("README.md not found in the repository contents")

    current_sha = match["sha"]
    cached_row = get_cached_record(current_sha)

    # If SHA matches cache, return the cached content
    if cached_row and cached_row[1] == current_sha:
        _, sha, content, _ = cached_row
        return content, current_sha

    # Else, fetch new README content and cache it
    response = requests.get(match["git_url"])
    if response.status_code == 200:
        data = response.json()
        base64_content = data["content"]
        content = translate_base64_content_to_text(base64_content)
        update_cache(current_sha, content)
        return content, current_sha

    return None


def get_repo_contents() -> list[GitHubFileItem]:
    """
    Fetch the contents of the YDKJS repository.
    :return: A list of GitHubFileItem representing the contents of the repository.
    """
    import requests

    response = requests.get(f"{ydkjs_base_repo_url}/contents")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(
            f"Failed to fetch repository contents: {response.status_code} {response.text}"
        )


def get_repo_book_contents(book_url: str) -> GitHubBookItem | None:
    """
    Fetch the contents of the YDKJS repository.
    :return: A list of GitHubFileItem representing the contents of the repository.
    """
    import requests

    response = requests.get(book_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(
            f"Failed to fetch repository contents: {response.status_code} {response.text}"
        )
