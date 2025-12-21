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
  password: string | null;
  name: string | null;
  image: string | null;
  googleId: string | null;
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

// Authorization entities
export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: number; // SQLite stores boolean as 0/1
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isSystem: number; // SQLite stores boolean as 0/1
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  createdAt: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  createdAt: string;
}

// Skill entity
export interface Skill {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  color: number;
  parentId: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Skill with children for tree structure
export interface SkillWithChildren extends Skill {
  children?: SkillWithChildren[];
}

// Course entity
export interface Course {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: "draft" | "published" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment entity (User joins Course)
export interface Enrollment {
  id: number;
  userId: string;
  courseId: number;
  status: "active" | "completed" | "dropped";
  enrolledAt: string;
  completedAt: string | null;
}

// Course with enrollment count
export interface CourseWithStats extends Course {
  enrollmentCount?: number;
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
      data: { email: string; password?: string; name?: string; image?: string; googleId?: string }
    ): Promise<User> {
      const id = generateId();
      const now = new Date().toISOString();
      await d1
        .prepare(
          "INSERT INTO User (id, email, password, name, image, googleId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(id, data.email, data.password || null, data.name || null, data.image || null, data.googleId || null, now, now)
        .run();
      return (await db.user.findById(d1, id))!;
    },

    async findByGoogleId(d1: D1Database, googleId: string): Promise<User | null> {
      return d1
        .prepare("SELECT * FROM User WHERE googleId = ?")
        .bind(googleId)
        .first<User>();
    },

    async updateGoogleId(
      d1: D1Database,
      id: string,
      data: { googleId: string; image?: string; name?: string }
    ): Promise<User> {
      const now = new Date().toISOString();
      const updates: string[] = ["updatedAt = ?", "googleId = ?"];
      const values: unknown[] = [now, data.googleId];

      if (data.image !== undefined) {
        updates.push("image = ?");
        values.push(data.image);
      }
      if (data.name !== undefined) {
        updates.push("name = ?");
        values.push(data.name);
      }

      values.push(id);
      await d1
        .prepare(`UPDATE User SET ${updates.join(", ")} WHERE id = ?`)
        .bind(...values)
        .run();
      return (await db.user.findById(d1, id))!;
    },

    async count(d1: D1Database): Promise<number> {
      const result = await d1
        .prepare("SELECT COUNT(*) as count FROM User")
        .first<{ count: number }>();
      return result?.count || 0;
    },

    async findAll(
      d1: D1Database,
      options?: { limit?: number; offset?: number; search?: string }
    ): Promise<{ users: User[]; total: number }> {
      const limit = options?.limit || 20;
      const offset = options?.offset || 0;
      const search = options?.search;

      let countQuery = "SELECT COUNT(*) as count FROM User";
      let selectQuery = "SELECT * FROM User";
      const params: unknown[] = [];

      if (search) {
        const searchCondition = " WHERE email LIKE ? OR name LIKE ?";
        countQuery += searchCondition;
        selectQuery += searchCondition;
        params.push(`%${search}%`, `%${search}%`);
      }

      selectQuery += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";

      const countResult = await d1
        .prepare(countQuery)
        .bind(...params)
        .first<{ count: number }>();

      const result = await d1
        .prepare(selectQuery)
        .bind(...params, limit, offset)
        .all<User>();

      return {
        users: result.results,
        total: countResult?.count || 0,
      };
    },

    async delete(d1: D1Database, id: string): Promise<void> {
      await d1.prepare("DELETE FROM User WHERE id = ?").bind(id).run();
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

  // Role operations
  role: {
    async findAll(d1: D1Database): Promise<Role[]> {
      const result = await d1
        .prepare("SELECT * FROM Role ORDER BY name ASC")
        .all<Role>();
      return result.results;
    },

    async findById(d1: D1Database, id: string): Promise<Role | null> {
      return d1
        .prepare("SELECT * FROM Role WHERE id = ?")
        .bind(id)
        .first<Role>();
    },

    async findByName(d1: D1Database, name: string): Promise<Role | null> {
      return d1
        .prepare("SELECT * FROM Role WHERE name = ?")
        .bind(name)
        .first<Role>();
    },

    async create(
      d1: D1Database,
      data: { name: string; description?: string }
    ): Promise<Role> {
      const id = generateId();
      const now = new Date().toISOString();
      await d1
        .prepare(
          "INSERT INTO Role (id, name, description, isSystem, createdAt, updatedAt) VALUES (?, ?, ?, 0, ?, ?)"
        )
        .bind(id, data.name, data.description || null, now, now)
        .run();
      return (await db.role.findById(d1, id))!;
    },

    async update(
      d1: D1Database,
      id: string,
      data: { description?: string }
    ): Promise<Role> {
      const now = new Date().toISOString();
      const updates: string[] = ["updatedAt = ?"];
      const values: unknown[] = [now];

      if (data.description !== undefined) {
        updates.push("description = ?");
        values.push(data.description);
      }

      values.push(id);
      await d1
        .prepare(`UPDATE Role SET ${updates.join(", ")} WHERE id = ?`)
        .bind(...values)
        .run();
      return (await db.role.findById(d1, id))!;
    },

    async delete(d1: D1Database, id: string): Promise<void> {
      await d1
        .prepare("DELETE FROM Role WHERE id = ? AND isSystem = 0")
        .bind(id)
        .run();
    },

    async countUsers(d1: D1Database, roleId: string): Promise<number> {
      const result = await d1
        .prepare("SELECT COUNT(*) as count FROM UserRole WHERE roleId = ?")
        .bind(roleId)
        .first<{ count: number }>();
      return result?.count || 0;
    },
  },

  // Permission operations
  permission: {
    async findAll(d1: D1Database): Promise<Permission[]> {
      const result = await d1
        .prepare("SELECT * FROM Permission ORDER BY resource, action ASC")
        .all<Permission>();
      return result.results;
    },

    async findById(d1: D1Database, id: string): Promise<Permission | null> {
      return d1
        .prepare("SELECT * FROM Permission WHERE id = ?")
        .bind(id)
        .first<Permission>();
    },

    async findByName(d1: D1Database, name: string): Promise<Permission | null> {
      return d1
        .prepare("SELECT * FROM Permission WHERE name = ?")
        .bind(name)
        .first<Permission>();
    },

    async create(
      d1: D1Database,
      data: { name: string; description?: string; resource: string; action: string }
    ): Promise<Permission> {
      const id = generateId();
      const now = new Date().toISOString();
      await d1
        .prepare(
          "INSERT INTO Permission (id, name, description, resource, action, isSystem, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 0, ?, ?)"
        )
        .bind(id, data.name, data.description || null, data.resource, data.action, now, now)
        .run();
      return (await db.permission.findById(d1, id))!;
    },

    async delete(d1: D1Database, id: string): Promise<void> {
      await d1
        .prepare("DELETE FROM Permission WHERE id = ? AND isSystem = 0")
        .bind(id)
        .run();
    },

    async findByRoleIds(d1: D1Database, roleIds: string[]): Promise<Permission[]> {
      if (roleIds.length === 0) return [];
      const placeholders = roleIds.map(() => "?").join(",");
      const result = await d1
        .prepare(
          `SELECT DISTINCT p.* FROM Permission p
           INNER JOIN RolePermission rp ON rp.permissionId = p.id
           WHERE rp.roleId IN (${placeholders})`
        )
        .bind(...roleIds)
        .all<Permission>();
      return result.results;
    },
  },

  // UserRole operations
  userRole: {
    async findByUserId(d1: D1Database, userId: string): Promise<Role[]> {
      const result = await d1
        .prepare(
          `SELECT r.* FROM Role r
           INNER JOIN UserRole ur ON ur.roleId = r.id
           WHERE ur.userId = ?`
        )
        .bind(userId)
        .all<Role>();
      return result.results;
    },

    async assign(d1: D1Database, userId: string, roleId: string): Promise<void> {
      const now = new Date().toISOString();
      await d1
        .prepare("INSERT INTO UserRole (userId, roleId, createdAt) VALUES (?, ?, ?)")
        .bind(userId, roleId, now)
        .run();
    },

    async remove(d1: D1Database, userId: string, roleId: string): Promise<void> {
      await d1
        .prepare("DELETE FROM UserRole WHERE userId = ? AND roleId = ?")
        .bind(userId, roleId)
        .run();
    },

    async exists(d1: D1Database, userId: string, roleId: string): Promise<boolean> {
      const result = await d1
        .prepare("SELECT 1 FROM UserRole WHERE userId = ? AND roleId = ?")
        .bind(userId, roleId)
        .first<{ 1: number }>();
      return result !== null;
    },

    async countAdmins(d1: D1Database): Promise<number> {
      const result = await d1
        .prepare(
          `SELECT COUNT(DISTINCT ur.userId) as count
           FROM UserRole ur
           INNER JOIN Role r ON r.id = ur.roleId
           WHERE r.name = 'admin'`
        )
        .first<{ count: number }>();
      return result?.count || 0;
    },

    async findUsersByRoleId(d1: D1Database, roleId: string): Promise<User[]> {
      const result = await d1
        .prepare(
          `SELECT u.* FROM User u
           INNER JOIN UserRole ur ON ur.userId = u.id
           WHERE ur.roleId = ?`
        )
        .bind(roleId)
        .all<User>();
      return result.results;
    },
  },

  // RolePermission operations
  rolePermission: {
    async findByRoleId(d1: D1Database, roleId: string): Promise<Permission[]> {
      const result = await d1
        .prepare(
          `SELECT p.* FROM Permission p
           INNER JOIN RolePermission rp ON rp.permissionId = p.id
           WHERE rp.roleId = ?`
        )
        .bind(roleId)
        .all<Permission>();
      return result.results;
    },

    async assign(d1: D1Database, roleId: string, permissionId: string): Promise<void> {
      const now = new Date().toISOString();
      await d1
        .prepare("INSERT INTO RolePermission (roleId, permissionId, createdAt) VALUES (?, ?, ?)")
        .bind(roleId, permissionId, now)
        .run();
    },

    async remove(d1: D1Database, roleId: string, permissionId: string): Promise<void> {
      await d1
        .prepare("DELETE FROM RolePermission WHERE roleId = ? AND permissionId = ?")
        .bind(roleId, permissionId)
        .run();
    },

    async sync(d1: D1Database, roleId: string, permissionIds: string[]): Promise<void> {
      // Delete existing permissions
      await d1
        .prepare("DELETE FROM RolePermission WHERE roleId = ?")
        .bind(roleId)
        .run();

      // Insert new permissions
      const now = new Date().toISOString();
      for (const permissionId of permissionIds) {
        await d1
          .prepare("INSERT INTO RolePermission (roleId, permissionId, createdAt) VALUES (?, ?, ?)")
          .bind(roleId, permissionId, now)
          .run();
      }
    },
  },

  // Skill operations
  skill: {
    async findAll(d1: D1Database): Promise<Skill[]> {
      const result = await d1
        .prepare("SELECT * FROM Skill ORDER BY name ASC")
        .all<Skill>();
      return result.results;
    },

    async findById(d1: D1Database, id: number): Promise<Skill | null> {
      return d1
        .prepare("SELECT * FROM Skill WHERE id = ?")
        .bind(id)
        .first<Skill>();
    },

    async findByParentId(d1: D1Database, parentId: number | null): Promise<Skill[]> {
      const result = await d1
        .prepare(
          parentId === null
            ? "SELECT * FROM Skill WHERE parentId IS NULL ORDER BY name ASC"
            : "SELECT * FROM Skill WHERE parentId = ? ORDER BY name ASC"
        )
        .bind(...(parentId === null ? [] : [parentId]))
        .all<Skill>();
      return result.results;
    },

    async create(
      d1: D1Database,
      data: {
        name: string;
        description?: string;
        icon?: string;
        color?: number;
        parentId?: number | null;
        createdBy: string;
      }
    ): Promise<Skill> {
      const now = new Date().toISOString();
      const result = await d1
        .prepare(
          `INSERT INTO Skill (name, description, icon, color, parentId, createdBy, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.name,
          data.description || null,
          data.icon || "FileText",
          data.color ?? 0,
          data.parentId ?? null,
          data.createdBy,
          now,
          now
        )
        .run();
      return (await db.skill.findById(d1, result.meta.last_row_id))!;
    },

    async update(
      d1: D1Database,
      id: number,
      data: {
        name?: string;
        description?: string | null;
        icon?: string;
        color?: number;
        parentId?: number | null;
      }
    ): Promise<Skill> {
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
      if (data.icon !== undefined) {
        updates.push("icon = ?");
        values.push(data.icon);
      }
      if (data.color !== undefined) {
        updates.push("color = ?");
        values.push(data.color);
      }
      if (data.parentId !== undefined) {
        updates.push("parentId = ?");
        values.push(data.parentId);
      }

      values.push(id);
      await d1
        .prepare(`UPDATE Skill SET ${updates.join(", ")} WHERE id = ?`)
        .bind(...values)
        .run();
      return (await db.skill.findById(d1, id))!;
    },

    async delete(d1: D1Database, id: number): Promise<void> {
      // CASCADE delete will handle children
      await d1.prepare("DELETE FROM Skill WHERE id = ?").bind(id).run();
    },

    async countChildren(d1: D1Database, parentId: number): Promise<number> {
      const result = await d1
        .prepare("SELECT COUNT(*) as count FROM Skill WHERE parentId = ?")
        .bind(parentId)
        .first<{ count: number }>();
      return result?.count || 0;
    },

    async countAllDescendants(d1: D1Database, skillId: number): Promise<number> {
      // Recursive CTE to count all descendants
      const result = await d1
        .prepare(
          `WITH RECURSIVE descendants AS (
            SELECT id FROM Skill WHERE parentId = ?
            UNION ALL
            SELECT s.id FROM Skill s INNER JOIN descendants d ON s.parentId = d.id
          )
          SELECT COUNT(*) as count FROM descendants`
        )
        .bind(skillId)
        .first<{ count: number }>();
      return result?.count || 0;
    },

    async getAllDescendantIds(d1: D1Database, skillId: number): Promise<number[]> {
      const result = await d1
        .prepare(
          `WITH RECURSIVE descendants AS (
            SELECT id FROM Skill WHERE parentId = ?
            UNION ALL
            SELECT s.id FROM Skill s INNER JOIN descendants d ON s.parentId = d.id
          )
          SELECT id FROM descendants`
        )
        .bind(skillId)
        .all<{ id: number }>();
      return result.results.map((r) => r.id);
    },

    async getAncestors(d1: D1Database, skillId: number): Promise<Skill[]> {
      const result = await d1
        .prepare(
          `WITH RECURSIVE ancestors AS (
            SELECT * FROM Skill WHERE id = (SELECT parentId FROM Skill WHERE id = ?)
            UNION ALL
            SELECT s.* FROM Skill s INNER JOIN ancestors a ON s.id = a.parentId
          )
          SELECT * FROM ancestors`
        )
        .bind(skillId)
        .all<Skill>();
      return result.results.reverse(); // Return from root to parent
    },

    async getDepth(d1: D1Database, skillId: number): Promise<number> {
      const ancestors = await db.skill.getAncestors(d1, skillId);
      return ancestors.length + 1; // +1 for the skill itself
    },

    async isDescendantOf(d1: D1Database, skillId: number, potentialAncestorId: number): Promise<boolean> {
      const ancestors = await db.skill.getAncestors(d1, skillId);
      return ancestors.some((a) => a.id === potentialAncestorId);
    },

    async buildTree(d1: D1Database, skills?: Skill[]): Promise<SkillWithChildren[]> {
      const allSkills = skills || await db.skill.findAll(d1);
      const skillMap = new Map<number, SkillWithChildren>();
      const rootSkills: SkillWithChildren[] = [];

      // First pass: create map
      for (const skill of allSkills) {
        skillMap.set(skill.id, { ...skill, children: [] });
      }

      // Second pass: build tree
      for (const skill of allSkills) {
        const skillWithChildren = skillMap.get(skill.id)!;
        if (skill.parentId === null) {
          rootSkills.push(skillWithChildren);
        } else {
          const parent = skillMap.get(skill.parentId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(skillWithChildren);
          } else {
            // Orphan skill (parent doesn't exist), treat as root
            rootSkills.push(skillWithChildren);
          }
        }
      }

      return rootSkills;
    },

    async search(d1: D1Database, query: string): Promise<Skill[]> {
      const result = await d1
        .prepare("SELECT * FROM Skill WHERE name LIKE ? ORDER BY name ASC")
        .bind(`%${query}%`)
        .all<Skill>();
      return result.results;
    },
  },

  // Course operations
  course: {
    async findAll(d1: D1Database, status?: string): Promise<Course[]> {
      const query = status
        ? "SELECT * FROM Course WHERE status = ? ORDER BY createdAt DESC"
        : "SELECT * FROM Course ORDER BY createdAt DESC";
      const result = await d1
        .prepare(query)
        .bind(...(status ? [status] : []))
        .all<Course>();
      return result.results;
    },

    async findById(d1: D1Database, id: number): Promise<Course | null> {
      return d1
        .prepare("SELECT * FROM Course WHERE id = ?")
        .bind(id)
        .first<Course>();
    },

    async findPublished(d1: D1Database): Promise<Course[]> {
      const result = await d1
        .prepare("SELECT * FROM Course WHERE status = 'published' ORDER BY createdAt DESC")
        .all<Course>();
      return result.results;
    },

    async create(
      d1: D1Database,
      data: {
        name: string;
        description?: string;
        imageUrl?: string;
        status?: "draft" | "published" | "archived";
        createdBy: string;
      }
    ): Promise<Course> {
      const now = new Date().toISOString();
      const result = await d1
        .prepare(
          `INSERT INTO Course (name, description, imageUrl, status, createdBy, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.name,
          data.description || null,
          data.imageUrl || null,
          data.status || "draft",
          data.createdBy,
          now,
          now
        )
        .run();
      return (await db.course.findById(d1, result.meta.last_row_id))!;
    },

    async update(
      d1: D1Database,
      id: number,
      data: {
        name?: string;
        description?: string | null;
        imageUrl?: string | null;
        status?: "draft" | "published" | "archived";
      }
    ): Promise<Course> {
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
      if (data.imageUrl !== undefined) {
        updates.push("imageUrl = ?");
        values.push(data.imageUrl);
      }
      if (data.status !== undefined) {
        updates.push("status = ?");
        values.push(data.status);
      }

      values.push(id);
      await d1
        .prepare(`UPDATE Course SET ${updates.join(", ")} WHERE id = ?`)
        .bind(...values)
        .run();
      return (await db.course.findById(d1, id))!;
    },

    async delete(d1: D1Database, id: number): Promise<void> {
      await d1.prepare("DELETE FROM Course WHERE id = ?").bind(id).run();
    },

    async search(d1: D1Database, query: string): Promise<Course[]> {
      const result = await d1
        .prepare("SELECT * FROM Course WHERE name LIKE ? ORDER BY name ASC")
        .bind(`%${query}%`)
        .all<Course>();
      return result.results;
    },

    async getEnrollmentCount(d1: D1Database, courseId: number): Promise<number> {
      const result = await d1
        .prepare("SELECT COUNT(*) as count FROM Enrollment WHERE courseId = ? AND status = 'active'")
        .bind(courseId)
        .first<{ count: number }>();
      return result?.count || 0;
    },
  },

  // Enrollment operations
  enrollment: {
    async findByUserId(d1: D1Database, userId: string): Promise<Enrollment[]> {
      const result = await d1
        .prepare("SELECT * FROM Enrollment WHERE userId = ? ORDER BY enrolledAt DESC")
        .bind(userId)
        .all<Enrollment>();
      return result.results;
    },

    async findByCourseId(d1: D1Database, courseId: number): Promise<Enrollment[]> {
      const result = await d1
        .prepare("SELECT * FROM Enrollment WHERE courseId = ? ORDER BY enrolledAt DESC")
        .bind(courseId)
        .all<Enrollment>();
      return result.results;
    },

    async findByUserAndCourse(d1: D1Database, userId: string, courseId: number): Promise<Enrollment | null> {
      return d1
        .prepare("SELECT * FROM Enrollment WHERE userId = ? AND courseId = ?")
        .bind(userId, courseId)
        .first<Enrollment>();
    },

    async create(
      d1: D1Database,
      data: {
        userId: string;
        courseId: number;
      }
    ): Promise<Enrollment> {
      const now = new Date().toISOString();
      const result = await d1
        .prepare(
          `INSERT INTO Enrollment (userId, courseId, status, enrolledAt)
           VALUES (?, ?, 'active', ?)`
        )
        .bind(data.userId, data.courseId, now)
        .run();
      return (await d1
        .prepare("SELECT * FROM Enrollment WHERE id = ?")
        .bind(result.meta.last_row_id)
        .first<Enrollment>())!;
    },

    async updateStatus(
      d1: D1Database,
      userId: string,
      courseId: number,
      status: "active" | "completed" | "dropped"
    ): Promise<Enrollment | null> {
      const now = new Date().toISOString();
      const completedAt = status === "completed" ? now : null;
      await d1
        .prepare("UPDATE Enrollment SET status = ?, completedAt = ? WHERE userId = ? AND courseId = ?")
        .bind(status, completedAt, userId, courseId)
        .run();
      return db.enrollment.findByUserAndCourse(d1, userId, courseId);
    },

    async delete(d1: D1Database, userId: string, courseId: number): Promise<void> {
      await d1
        .prepare("DELETE FROM Enrollment WHERE userId = ? AND courseId = ?")
        .bind(userId, courseId)
        .run();
    },

    async isEnrolled(d1: D1Database, userId: string, courseId: number): Promise<boolean> {
      const enrollment = await db.enrollment.findByUserAndCourse(d1, userId, courseId);
      return enrollment !== null && enrollment.status === "active";
    },
  },
};
