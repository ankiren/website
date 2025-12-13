-- Create Users table
CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,  -- Nullable for Google OAuth users
  name TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create Decks table
CREATE TABLE IF NOT EXISTS Deck (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

-- Create Cards table
CREATE TABLE IF NOT EXISTS Card (
  id TEXT PRIMARY KEY NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  deckId TEXT NOT NULL,
  FOREIGN KEY (deckId) REFERENCES Deck(id) ON DELETE CASCADE
);

-- Create Reviews table
CREATE TABLE IF NOT EXISTS Review (
  id TEXT PRIMARY KEY NOT NULL,
  easeFactor REAL NOT NULL DEFAULT 2.5,
  interval INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  dueDate TEXT NOT NULL DEFAULT (datetime('now')),
  lastReviewDate TEXT,
  cardId TEXT NOT NULL,
  userId TEXT NOT NULL,
  FOREIGN KEY (cardId) REFERENCES Card(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  UNIQUE (cardId, userId)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deck_userId ON Deck(userId);
CREATE INDEX IF NOT EXISTS idx_card_deckId ON Card(deckId);
CREATE INDEX IF NOT EXISTS idx_review_cardId ON Review(cardId);
CREATE INDEX IF NOT EXISTS idx_review_userId ON Review(userId);
CREATE INDEX IF NOT EXISTS idx_review_dueDate ON Review(dueDate);
