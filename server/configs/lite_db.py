import sqlite3
from pathlib import Path
from contextlib import contextmanager

DB_PATH = Path("app.db")


@contextmanager
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def run_db_query(query: str, params=(), fetchone=False, fetchall=False):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        if fetchone:
            return cursor.fetchone()
        if fetchall:
            return cursor.fetchall()
        return None
