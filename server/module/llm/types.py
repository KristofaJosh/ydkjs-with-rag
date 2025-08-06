from typing import TypedDict, Union, List, Dict, Literal


class SingleBook(TypedDict):
    order: int
    url: str
    sha: str


ReadingOrder = Dict[str, SingleBook]
