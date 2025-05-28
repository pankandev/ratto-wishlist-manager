from typing import TypeVar

T = TypeVar('T')


def to_list(v: list[T] | T) -> list[T]:
    if isinstance(v, list):
        return v
    return [v]