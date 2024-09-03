import { createCookieSessionStorage } from "@remix-run/node";
import { env } from "./env.server";

export interface SessionData {
  username: string;
  /** The ID of the user in the DB */
  userId: string;
}

export interface SessionFlashData {
  error: string;
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      path: "/",
      // eslint-disable-next-line no-restricted-properties
      secure: process.env.NODE_ENV === "production",
      secrets: [env.JWT_SECRET],
    },
  });

export { getSession, commitSession, destroySession };
