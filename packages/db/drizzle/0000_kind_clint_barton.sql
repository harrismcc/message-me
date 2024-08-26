CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"body" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
