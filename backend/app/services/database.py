import os
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pymongo import MongoClient
from app.config import settings

class LocalMockCollection:
    """In-memory PyMongo-compatible collection with persistent JSON storage fallback."""
    def __init__(self, db_store: dict, coll_name: str, save_callback):
        self.coll_name = coll_name
        self.db_store = db_store
        self.save_callback = save_callback
        if coll_name not in self.db_store:
            self.db_store[coll_name] = []

    def _matches(self, doc: dict, query: dict) -> bool:
        for k, v in query.items():
            if k == "_id":
                if str(doc.get("_id")) != str(v) and str(doc.get("id")) != str(v):
                    return False
            elif isinstance(v, dict):
                # Simple operator support ($in, $ne)
                if "$in" in v and doc.get(k) not in v["$in"]:
                    return False
                if "$ne" in v and doc.get(k) == v["$ne"]:
                    return False
            elif doc.get(k) != v:
                return False
        return True

    def insert_one(self, doc: dict):
        new_doc = dict(doc)
        if "_id" not in new_doc:
            new_doc["_id"] = str(uuid.uuid4())
        if "id" not in new_doc:
            new_doc["id"] = str(new_doc["_id"])
        self.db_store[self.coll_name].append(new_doc)
        self.save_callback()
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(new_doc["_id"])

    def find_one(self, query: dict = None) -> Optional[dict]:
        query = query or {}
        for doc in self.db_store[self.coll_name]:
            if self._matches(doc, query):
                return dict(doc)
        return None

    def find(self, query: dict = None):
        query = query or {}
        results = [dict(d) for d in self.db_store[self.coll_name] if self._matches(d, query)]
        return LocalCursor(results)

    def count_documents(self, query: dict = None) -> int:
        query = query or {}
        return sum(1 for d in self.db_store[self.coll_name] if self._matches(d, query))

    def update_one(self, query: dict, update: dict):
        class UpdateResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count

        for idx, doc in enumerate(self.db_store[self.coll_name]):
            if self._matches(doc, query):
                if "$set" in update:
                    doc.update(update["$set"])
                else:
                    doc.update(update)
                self.db_store[self.coll_name][idx] = doc
                self.save_callback()
                return UpdateResult(1)
        return UpdateResult(0)

    def delete_one(self, query: dict):
        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count

        for idx, doc in enumerate(self.db_store[self.coll_name]):
            if self._matches(doc, query):
                del self.db_store[self.coll_name][idx]
                self.save_callback()
                return DeleteResult(1)
        return DeleteResult(0)


class LocalCursor:
    def __init__(self, data: List[dict]):
        self._data = data

    def sort(self, key_or_list, direction=1):
        if isinstance(key_or_list, list):
            key, direction = key_or_list[0]
        else:
            key = key_or_list
        reverse = direction < 0
        self._data.sort(key=lambda x: x.get(key) or "", reverse=reverse)
        return self

    def skip(self, n: int):
        self._data = self._data[n:]
        return self

    def limit(self, n: int):
        self._data = self._data[:n]
        return self

    def __iter__(self):
        return iter(self._data)

    def to_list(self):
        return list(self._data)


class LocalDatabase:
    """Local JSON-persisted PyMongo substitute for standalone development."""
    def __init__(self, filepath: str = "fetal_health_local_db.json"):
        self.filepath = filepath
        self.store = {"users": [], "patients": [], "assessments": []}
        self._load()

    def _load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    self.store = json.load(f)
            except Exception as e:
                print(f"[LocalDatabase] Warning: Could not read {self.filepath}: {e}")

    def _save(self):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self.store, f, indent=2, default=str)
        except Exception as e:
            print(f"[LocalDatabase] Warning: Could not save {self.filepath}: {e}")

    def __getitem__(self, coll_name: str) -> LocalMockCollection:
        return LocalMockCollection(self.store, coll_name, self._save)


class DatabaseManager:
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.is_connected = False
        self._connect()

    def _connect(self):
        try:
            client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=1500,
                connectTimeoutMS=1500
            )
            # Check connection
            client.admin.command("ping")
            self.client = client
            self.db = client[settings.DATABASE_NAME]
            self.is_connected = True
            print(f"[Database] Successfully connected to live MongoDB at {settings.MONGODB_URI}")
        except Exception as e:
            print(f"[Database] Notice: Live MongoDB not accessible ({e}). Initializing embedded database fallback.")
            self.db = LocalDatabase()
            self.is_connected = False

    def get_collection(self, name: str):
        if self.db is None:
            self._connect()
        return self.db[name]

db_manager = DatabaseManager()

def get_users_collection():
    return db_manager.get_collection("users")

def get_patients_collection():
    return db_manager.get_collection("patients")

def get_assessments_collection():
    return db_manager.get_collection("assessments")
