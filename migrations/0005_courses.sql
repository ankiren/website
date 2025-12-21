-- Course Management Tables
-- Migration: 0005_courses.sql

-- Course table
CREATE TABLE IF NOT EXISTS Course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  createdBy TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES User(id) ON DELETE CASCADE
);

-- Enrollment table (User joins Course)
CREATE TABLE IF NOT EXISTS Enrollment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  courseId INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, dropped
  enrolledAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completedAt TEXT,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE,
  UNIQUE(userId, courseId)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_course_status ON Course(status);
CREATE INDEX IF NOT EXISTS idx_course_createdBy ON Course(createdBy);
CREATE INDEX IF NOT EXISTS idx_enrollment_userId ON Enrollment(userId);
CREATE INDEX IF NOT EXISTS idx_enrollment_courseId ON Enrollment(courseId);
CREATE INDEX IF NOT EXISTS idx_enrollment_status ON Enrollment(status);
