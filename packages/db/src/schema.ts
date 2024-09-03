import { serial, text, timestamp, pgTable, uuid } from "drizzle-orm/pg-core";

export const message = pgTable("messages", {
  // The message ID
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // The sender
  senderId: uuid("senderId")
    .notNull()
    .references(() => user.id),
  // The body of the message
  body: text("body").notNull(),
  // When was the message created?
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  // When was the message actually printed? May be useful for future queues
  printedAt: timestamp("printedAt"),
});

export const user = pgTable("users", {
  // The ID of the user
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // The user's username
  username: text("username").notNull(),
  // The time the user was created
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
