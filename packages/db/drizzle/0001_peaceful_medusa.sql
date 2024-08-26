ALTER TABLE "messages" RENAME COLUMN "name" TO "sender";--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "printedAt" timestamp;