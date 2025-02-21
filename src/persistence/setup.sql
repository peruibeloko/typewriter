CREATE TABLE IF NOT EXISTS
  auth (
    email TEXT PRIMARY KEY,
    isActive NUMERIC NOT NULL DEFAULT 0
  );

CREATE TABLE IF NOT EXISTS
  users (
    email TEXT PRIMARY KEY,
    displayName TEXT NOT NULL,
    totpSecret TEXT NOT NULL
  );

CREATE TABLE IF NOT EXISTS
  posts (
    title TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    draft NUMERIC NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    modified_at INTEGER NOT NULL DEFAULT (unixepoch()),
    author_id INTEGER NOT NULL REFERENCES users (rowid)
  );