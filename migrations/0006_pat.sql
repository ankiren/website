-- Personal Access Tokens (PAT) for API authentication
-- Tokens are hashed with SHA-256 before storage

CREATE TABLE IF NOT EXISTS PersonalAccessToken (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  tokenHash TEXT NOT NULL,
  lastUsedAt TEXT,
  expiresAt TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_pat_userId ON PersonalAccessToken(userId);

-- Index for token validation (most frequent operation)
CREATE INDEX IF NOT EXISTS idx_pat_tokenHash ON PersonalAccessToken(tokenHash);
