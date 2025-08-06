from configs.lite_db import run_db_query


def get_cached_record(value: str, column: str = "sha"):
    row = run_db_query(
        f"SELECT * FROM readme_cache WHERE {column} = ? ORDER BY id DESC LIMIT 1",
        (value,),
        fetchone=True,
    )
    return row


# def update_cache_record(**kwargs) -> None:
#     columns = ", ".join(kwargs.keys())
#     placeholders = ", ".join(["?"] * len(kwargs))
#     values = tuple(kwargs.values())
#     query = f"INSERT INTO readme_cache ({columns}) VALUES ({placeholders})"
#     run_db_query(query, values)


def update_cache(sha: str, content: str) -> None:
    run_db_query(
        "INSERT INTO readme_cache (sha, content) VALUES (?, ?)", (sha, content)
    )


def init_cache_db() -> None:
    create_table = """
    CREATE TABLE IF NOT EXISTS readme_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sha TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    run_db_query(create_table)
