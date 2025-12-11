import { v4 as uuidv4 } from "uuid";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Type for D1 Database binding
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result<unknown>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(): Promise<T[]>;
}

interface D1Result<T> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Helper to get D1 from Cloudflare context
export function getD1(): D1Database {
  const { env } = getCloudflareContext();
  return (env as { DB: D1Database }).DB;
}

// Async version for SSG/ISR routes
export async function getD1Async(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return (env as { DB: D1Database }).DB;
}

// Generate CUID-like ID
export function generateId(): string {
  return uuidv4().replace(/-/g, "").slice(0, 25);
}

// User operations
export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;
  deckId: string;
}

export interface Review {
  id: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  lastReviewDate: string | null;
  cardId: string;
  userId: string;
}

// Database operations
export const db = {
  // User operations
  user: {
    async findByEmail(d1: D1Database, email: string): Promise<User | null> {
      return d1
        .prepare("SELECT * FROM User WHERE email = ?")
        .bind(email)
        .first<User>();
    },

    async findById(d1: D1Database, id: string): Promise<User | null> {
      return d1
        .prepare("SELECT * FROM User WHERE id = ?")
        .bind(id)
        .first<User>();
    },

    async create(
      d1: D1Database,
      data: { email: string; password: string; name?: string }
    ): Promise<User> {
      const id = generateId();
      const now = new Date().toISOString();
      await d1
        .prepare(
          "INSERT INTO User (id, email, password, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(id, data.email, data.password, data.name || null, now, now)
        .run();
      return (await db.user.findById(d1, id))!;
    },
  },

  // Deck operations
  deck: {
    async findByUserId(d1: D1Database, userId: string): Promise<Deck[]> {
      const result = await d1
        .prepare("SELECT * FROM Deck WHERE userId = ? ORDER BY updatedAt DESC")
        .bind(userId)
        .all<Deck>();
      return result.results;
    },

    async findById(d1: D1Database, id: string): Promise<Deck | null> {
      return d1
        .prepare("SELECT * FROM Deck WHERE id = ?")
        .bind(id)
        .first<Deck>();
    },

    async findByIdAndUserId(
      d1: D1Database,
      id: string,
      userId: string
    ): Promise<Deck | null> {
      return d1
        .prepare("SELECT * FROM Deck WHERE id = ? AND userId = ?")
        .bind(id, userId)
        .first<Deck>();
    },

    async create(
      d1: D1Database,
      data: { name: string; description?: string; userId: string }
    ): Promise<Deck> {
      const id = generateId();
      const now = new Date().toISOString();
      await d1
        .prepare(
          "INSERT INTO Deck (id, name, description, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(id, data.name, data.description || null, data.userId, now, now)
        .run();
      return (await db.deck.findById(d1, id))!;
    },

    async update(
      d1: D1Database,
      id: string,
      data: { name?: string; description?: string }
    ): Promise<Deck> {
      const now = new Date().toISOString();
      const updates: string[] = ["updatedAt = ?"];
      const values: unknown[] = [now];

      if (data.name !== undefined) {
        updates.push("name = ?");
        values.push(data.name);
      }
      if (data.description !== undefined) {
        updates.push("description = ?");
        values.push(data.description);
      }

      values.push(id);
      await d1
        .prepare(`UPDATE Deck SET ${updates.join(", ")} WHERE id = ?`)
        .bind(...values)
        .run();
      return (await db.deck.findById(d1, id))!;
    },

    async delete(d1: D1Database, id: string): Promise<void> {
      await d1.prepare("DELETE FROM Deck WHERE id = ?").bind(id).run();
    },

    async countCards(d1: D1Database, deckId: string): Promise<number> {
      const result = await d1
        .prepare("SELECT COUNT(*) as count FROM Card WHERE deckId = ?")
        .bind(deckId)
        .first<{ count: number }>();
      return result?.count || 0;
    },
  },

  // Card operations
  card: {
    async findByDeckId(d1: D1Database, deckId: string): Promise<Card[]> {
      const result = await d1
        .prepare("SELECT * FROM Card WHERE deckId = ? ORDER BY createdAt DESC")
        .bind(deckId)
        .all<Card>();
      return result.results;
    },

    async findById(d1: D1Database, id: string): Promise<Card | null> {
      return d1
        .prepare("SELECT * FROM Card WHERE id = ?")
        .bind(id)
        .first<Card>();
    },

    async findByIdWithDeck(
      d1: D1Database,
      id: string,
      userId: string
    ): Promise<(Card & { deck: Deck }) | null> {
      const card = await d1
        .prepare(
          `SELECT c.*, d.id as deckId, d.name as deckName, d.userId
           FROM Card c
           JOIN Deck d ON c.deckId = d.id
           WHERE c.id = ? AND d.userId = ?`
        )
        .bind(id, userId)
        .first<Card & { deckName: string; userId: string }>();

      if (!card) return null;

      const deck = await db.deck.findById(d1, card.deckId);
      if (!deck) return null;

      return { ...card, deck };
    },

    async create(
      d1: D1Database,
      data: { front: string; back: string; deckId: string }
    ): Promise<Card> {
      const id = generateId();
      const now = new Date().toISOString();
      await d1
        .prepare(
          "INSERT INTO Card (id, front, back, deckId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(id, data.front, data.back, data.deckId, now, now)
        .run();
      return (await db.card.findById(d1, id))!;
    },

    async update(
      d1: D1Database,
      id: string,
      data: { front?: string; back?: string }
    ): Promise<Card> {
      const now = new Date().toISOString();
      const updates: string[] = ["updatedAt = ?"];
      const values: unknown[] = [now];

      if (data.front !== undefined) {
        updates.push("front = ?");
        values.push(data.front);
      }
      if (data.back !== undefined) {
        updates.push("back = ?");
        values.push(data.back);
      }

      values.push(id);
      await d1
        .prepare(`UPDATE Card SET ${updates.join(", ")} WHERE id = ?`)
        .bind(...values)
        .run();
      return (await db.card.findById(d1, id))!;
    },

    async delete(d1: D1Database, id: string): Promise<void> {
      await d1.prepare("DELETE FROM Card WHERE id = ?").bind(id).run();
    },
  },

  // Review operations
  review: {
    async findByCardAndUser(
      d1: D1Database,
      cardId: string,
      userId: string
    ): Promise<Review | null> {
      return d1
        .prepare("SELECT * FROM Review WHERE cardId = ? AND userId = ?")
        .bind(cardId, userId)
        .first<Review>();
    },

    async findByUserAndDeck(
      d1: D1Database,
      userId: string,
      deckId: string
    ): Promise<Review[]> {
      const result = await d1
        .prepare(
          `SELECT r.* FROM Review r
           JOIN Card c ON r.cardId = c.id
           WHERE r.userId = ? AND c.deckId = ?`
        )
        .bind(userId, deckId)
        .all<Review>();
      return result.results;
    },

    async upsert(
      d1: D1Database,
      data: {
        cardId: string;
        userId: string;
        easeFactor: number;
        interval: number;
        repetitions: number;
        dueDate: Date;
        lastReviewDate: Date;
      }
    ): Promise<Review> {
      const existing = await db.review.findByCardAndUser(
        d1,
        data.cardId,
        data.userId
      );

      if (existing) {
        await d1
          .prepare(
            `UPDATE Review SET easeFactor = ?, interval = ?, repetitions = ?,
             dueDate = ?, lastReviewDate = ? WHERE cardId = ? AND userId = ?`
          )
          .bind(
            data.easeFactor,
            data.interval,
            data.repetitions,
            data.dueDate.toISOString(),
            data.lastReviewDate.toISOString(),
            data.cardId,
            data.userId
          )
          .run();
        return (await db.review.findByCardAndUser(d1, data.cardId, data.userId))!;
      } else {
        const id = generateId();
        await d1
          .prepare(
            `INSERT INTO Review (id, cardId, userId, easeFactor, interval, repetitions, dueDate, lastReviewDate)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            id,
            data.cardId,
            data.userId,
            data.easeFactor,
            data.interval,
            data.repetitions,
            data.dueDate.toISOString(),
            data.lastReviewDate.toISOString()
          )
          .run();
        return (await db.review.findByCardAndUser(d1, data.cardId, data.userId))!;
      }
    },

    async countDueByUserId(d1: D1Database, userId: string): Promise<number> {
      const result = await d1
        .prepare(
          `SELECT COUNT(*) as count FROM Review
           WHERE userId = ? AND dueDate <= datetime('now')`
        )
        .bind(userId)
        .first<{ count: number }>();
      return result?.count || 0;
    },
  },
};
