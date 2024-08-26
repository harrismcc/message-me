import { serial, text, timestamp, pgTable, uuid } from "drizzle-orm/pg-core";

export const message = pgTable("messages", {
  // The message ID
  id: uuid("id").notNull().defaultRandom(),
  // The sender
  sender: text("sender").notNull(),
  // The body of the message
  body: text("body").notNull(),
  // When was the message created?
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  // When was the message actually printed? May be useful for future queues
  printedAt: timestamp("printedAt"),
});
