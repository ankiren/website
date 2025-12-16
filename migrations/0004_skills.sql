-- Migration: 0004_skills.sql
-- Description: Create Skills table for hierarchical skill management

-- Create Skills table
CREATE TABLE IF NOT EXISTS Skill (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'FileText',
  color INTEGER DEFAULT 0,
  parentId INTEGER REFERENCES Skill(id) ON DELETE CASCADE,
  createdBy TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on parentId for faster tree queries
CREATE INDEX IF NOT EXISTS idx_skill_parent ON Skill(parentId);

-- Create index on createdBy for user-based queries
CREATE INDEX IF NOT EXISTS idx_skill_created_by ON Skill(createdBy);

-- Create index on name for search
CREATE INDEX IF NOT EXISTS idx_skill_name ON Skill(name);
