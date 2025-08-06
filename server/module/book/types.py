from typing import TypedDict


class Links(TypedDict):
    self: str
    git: str
    html: str


class GitHubFileItem(TypedDict):
    name: str
    path: str
    sha: str
    size: int
    url: str
    html_url: str
    git_url: str
    download_url: str
    type: str
    _links: Links


class GitHubBookItem(TypedDict):
    size: int
    url: str
    sha: str
    size: str
    node_id: str
    content: str
