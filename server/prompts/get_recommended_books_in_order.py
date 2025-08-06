from langchain_core.messages import HumanMessage, SystemMessage

from module.book.types import GitHubFileItem
import json


def get_recommended_books_in_order(
    readme: str, file_contents: list[GitHubFileItem]
) -> (str, str):
    """
    Generate a prompt to extract recommended books in order from the README content.
    Args:
        readme (str): The content of the README file.
        file_contents (list[GitHubFileItem]): A list of GitHub file items containing
           the `name`, `sha`, and `git_url` of each file.
    Returns:
        str: A formatted prompt for the LLM to extract the recommended books in order.
    """
    system_message = SystemMessage("""
    You are an assistant that extracts structured data from documentation.

    You are given:
    - The content of a README file
    - A list of repository files, where each item includes a `name`, `sha`, and `url`.

    Your goal is to parse the README, locate the section that lists the recommended reading order for books, and return a dictionary of books that match folders in the file list.

    Rules:
    - Only include books whose folder exists in the file list (e.g. if README says `get-started/README.md`, then look for an entry in the file list with name `get-started`).
    - The key of the dictionary is the book title from the README.
    - The value is an object with the `sha`, `order` (based on appearance), and `url` from the file list.
    - Do not include any book that is mentioned but has no matching folder.
    - Do not invent any values. Only use provided data.
    - Return a valid Python dictionary only. No extra text or comments.
    """)

    transformed = json.dumps(
        [
            {"sha": item["sha"], "name": item["name"], "url": item["git_url"]}
            for item in file_contents
            # Only include items that do not have a file extension
            if "." not in item["name"].split("/")[-1]
        ],
        indent=2,
    )

    user_message = HumanMessage(f"""
    ### README:
    {readme}

    ### File list:
    {transformed}
    """)

    return [system_message, user_message]


# FAILED PROMPT 1
# prompt = f"""
# Given the README content below, extract the recommended reading order for the books.
#
# You are provided with a list of repo files. Each file has a `sha`, `name` and `url`.
# Pay close attention to the order of the books, do not include any object that represents an image by name
# Using the `name` field, match the books mentioned in the README to their corresponding existing book data.
# Prioritize the available books over the README. If it doesn't match, skip it. Don't include image files.
# unbooks is an example of a book that is an image file, so it should be skipped.
# Match books mentioned in the README to their corresponding existing book data using these Books:\n
# {transformed}
#
# \n
# The README content is as follows:
# {readme}
# \n
# Output: Return a valid Python dictionary using this format:
# {{
#   "Book Title": {{
#     "sha": str,
#     "order": int,
#     "url": str
#   }}
# }}
#
# Only respond with the dictionary. No extra text.
# """


# FAILED PROMPT 2
#     prompt = f"""
#     You are given a README content and a list of files from a GitHub repo.
#     Your job is to extract the **second edition book reading order**, starting from the line:
#     ---
#     ### Important Rules:
#
#     1. Only include entries that reference a `README.md` path — such as `get-started/README.md`, `scope-closures/README.md`, etc.
#     2. Ignore any entry that does not include a `README.md` reference. For example:
#        - "The Unbooks" — skip
#        - Buy links only — skip
#     3. Match each `README.md` path against the provided file list.
#        - Each file has: `"name"`, `"url"`, and `"sha"`
#        - If a README file is not found in the list, skip it.
#     4. Ignore canceled, struck-through, or first-edition items.
#     5. For valid matches, assign `order` starting from 1, in the order they appear in the README.
#
#     ---
#
#     ### File list (array of objects):
#     {transformed}
#
#     ---
#
#     ### README:
#     {readme}
#
#     ---
#
#     ### Return:
#     A valid Python dictionary, using this format:
#
#     {{
#       "Book Title": {{
#         "sha": str,
#         "order": int,
#         "url": str
#       }}
#     }}
#
#     Only output the dictionary, no explanation or formatting.
#     """


# FAILED PROMPT 4
#     prompt = f"""
#     From the following README content, extract the recommended reading order for the **second edition** books.
#
#     Start parsing from the line:
#     "I recommend reading the **second edition** books in this order:"
#
#     Match only books that link to an actual `README.md` path — e.g. `get-started/README.md`, `scope-closures/README.md`, etc.
#
#     Ignore entries that:
#     - Do not contain a `README.md` path
#     - Are cancelled or struck-through
#     - Are part of older editions
#
#     Match those README.md paths against the provided file list. Each file has `sha`, `name`, and `url`. Only include books that exist in the list.
#
#     File list (name | url):
#     {transformed}
#
#     README:
#     {readme}
#
#     Return a valid Python dictionary using this format:
#     {{
#       "Book Title": {{
#         "sha": str,
#         "order": int,
#         "url": str | list[str]
#       }}
#     }}
#
#     Only return the dictionary. No explanation.


# FAILED PROMPT 5
#     prompt = f"""
#     From the following README content, extract the recommended reading order for the second edition books **only**.
#
#     Start your parsing from where the recommendation is explicitly stated:
#     "I recommend reading the **second edition** books in this order:"
#
#     Use only the books listed in that section, and skip any that are not present in the provided file list.
#
#     Each file has a `name`, `sha`, and `url`. Match books by name or path (e.g. folder/README.md).
#     Ignore any canceled or first edition content.
#
#     File list (name | url):
#     {book_list}
#
#     README:
#     {readme}
#
#     Return a valid Python dictionary like:
#     {{
#       "Book Title": {{
#         "sha": str,
#         "order": int,
#         "url": str | list[str]
#       }}
#     }}
#
#     Respond only with the dictionary. No extra text.
#     """

# prompt = f"""
# Given the README content below, extract the recommended reading order for the books.
#
# You are provided with a list of repo files. Each file has a `sha`, `name` and `url`.
# Pay close attention to the order of the books, do not include any object that represents an image by name
# Using the `name` field, match the books mentioned in the README to their corresponding existing book data.
# Prioritize the available books over the README. If it doesn't match, skip it. Don't include image files.
# unbooks is an example of a book that is an image file, so it should be skipped.
# Match books mentioned in the README to their corresponding existing book data using these Books:\n
# {transformed}
#
# \n
# The README content is as follows:
# {readme}
# \n
# Output: Return a valid Python dictionary using this format:
# {{
#   "Book Title": {{
#     "sha": str,
#     "order": int,
#     "url": str
#   }}
# }}
#
# Only respond with the dictionary. No extra text.
# """

#     prompt = f"""
#     You are given the content of a README and a list of book folder entries from a GitHub repo.
#
#     The README suggests a recommended reading order. Your job is to extract that list, but only include books that:
#     1. Are mentioned in the README after the section recommending the second edition books.
#     2. Match an item in the file list that ends with `/README.md` — ignore anything without a README.
#     3. Exclude any books that are canceled, in draft, or are part of the "Unbooks" section unless they include their own README.
#
#     Use the file list below. Each object includes `name`, `sha`, and `url`. This is your only source of truth.
#
#     {transformed}  # Your JSON list of folders/files
#
#     Only respond with a valid Python dictionary in this format:
#
#     {{
#       "Book Title": {{
#         "sha": str,
#         "order": int,
#         "url": str
#       }}
#     }}
#
#     - Do not include explanatory text.
#     - Start the order from 1 and increase only for valid entries.
#     - Only books that map to a README.md file should be included.
#     - Skip entries like "The Unbooks" if no direct README.md file is provided.
#
#     README:
#
#     {readme}
#     """
