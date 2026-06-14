"""Task persistence layer using SQLite for durability."""

import sqlite3
import json
from pathlib import Path
from typing import Any, Optional, Dict
from datetime import datetime


class TaskPersistenceManager:
    """Manages persistent task storage using SQLite."""

    def __init__(self, db_path: str = "/app/data/tasks.db"):
        """Initialize task persistence."""
        self.db_path = db_path
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        """Initialize SQLite database schema."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    task_id TEXT PRIMARY KEY,
                    domain TEXT NOT NULL,
                    scan_profile TEXT NOT NULL,
                    status TEXT NOT NULL,
                    current_step TEXT,
                    progress INTEGER DEFAULT 0,
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    task_data TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            conn.commit()

    def save_task(self, task_id: str, task_data: Dict[str, Any]) -> None:
        """Save or update a task in the database."""
        now = datetime.utcnow().isoformat() + "Z"
        task_json = json.dumps(task_data)

        with sqlite3.connect(self.db_path) as conn:
            # Check if task exists
            cursor = conn.execute("SELECT task_id FROM tasks WHERE task_id = ?", (task_id,))
            exists = cursor.fetchone() is not None

            if exists:
                # Update existing task
                conn.execute("""
                    UPDATE tasks 
                    SET status = ?, current_step = ?, progress = ?, 
                        completed_at = ?, task_data = ?, updated_at = ?
                    WHERE task_id = ?
                """, (
                    task_data.get("status"),
                    task_data.get("currentStep"),
                    task_data.get("progress"),
                    task_data.get("completedAt"),
                    task_json,
                    now,
                    task_id
                ))
            else:
                # Insert new task
                conn.execute("""
                    INSERT INTO tasks 
                    (task_id, domain, scan_profile, status, current_step, progress,
                     started_at, task_data, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    task_id,
                    task_data.get("domain"),
                    task_data.get("scanProfile"),
                    task_data.get("status"),
                    task_data.get("currentStep"),
                    task_data.get("progress"),
                    task_data.get("startedAt"),
                    task_json,
                    now,
                    now
                ))
            conn.commit()

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a task from the database."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT task_data FROM tasks WHERE task_id = ?",
                (task_id,)
            )
            row = cursor.fetchone()
            if row:
                return json.loads(row[0])
        return None

    def delete_task(self, task_id: str) -> None:
        """Delete a task from the database."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM tasks WHERE task_id = ?", (task_id,))
            conn.commit()

    def get_all_tasks(self) -> Dict[str, Dict[str, Any]]:
        """Retrieve all tasks from the database."""
        tasks = {}
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("SELECT task_id, task_data FROM tasks")
            for task_id, task_json in cursor.fetchall():
                tasks[task_id] = json.loads(task_json)
        return tasks
