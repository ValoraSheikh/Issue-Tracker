import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const issuePriority = pgEnum("issuePriority", ["High", "Medium", "Low"]);

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
});

export const projectTable = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  ownerId: varchar()
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  deleteAt: timestamp(),
});

export const issuesTable = pgTable("issues", {
  id: uuid().defaultRandom().primaryKey().unique(),
  name: varchar({ length: 400 }).notNull(),
  description: varchar().notNull(),
  projectId: varchar()
    .notNull()
    .references(() => projectTable.id),
  priority: issuePriority(),
  dueDate: timestamp(),
  assignee: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  lables: text()
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
});

export const notificationsTable = pgTable("notifications", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  issueId: varchar()
    .notNull()
    .references(() => issuesTable.id),
  assignee: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deletedAt: timestamp(),
});

export const commentsTable = pgTable("commments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  comment: varchar().notNull(),
  issueId: varchar()
    .notNull()
    .refrences(() => issueTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  deteledAt: timestamp(),
});
