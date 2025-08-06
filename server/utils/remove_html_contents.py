from bs4 import BeautifulSoup


def remove_html_contents(html):
    """
    Remove specific HTML tags and their content from the given HTML string.

    Args:
        html (str): The HTML content as a string.

    Returns:
        str: The cleaned text without the specified HTML tags.
    """
    soup = BeautifulSoup(html, "html.parser")

    # Remove entire tags and their content
    for tag in soup.find_all(["a", "img", "br"]):
        tag.decompose()

    return soup.get_text().strip()
