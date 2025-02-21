CREATE TABLE allowlist (
  email VARCHAR PRIMARY KEY ON CONFLICT ABORT,
  isActive BOOLEAN DEFAULT false
) STRICT WITHOUT ROWID;

CREATE TABLE users (
  email VARCHAR PRIMARY KEY ON CONFLICT ABORT,
  isActive BOOLEAN DEFAULT false
);

CREATE TABLE posts (
  title
  path
  draft
  fk_author
);