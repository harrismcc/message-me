import { db, user } from "@acme/db";
import type { Session } from "@remix-run/node";
import { eq } from "drizzle-orm";
import type { SessionData, SessionFlashData } from "~/sessions";

export const getOrCreateUser = async (
  session: Session<SessionData, SessionFlashData>,
  username: string,
) => {
  const userId = session.get("userId");
  if (!userId) {
    // No user id present, create a new user
    const [createdUser] = await db
      .insert(user)
      .values({
        username,
      })
      .returning();

    if (!createdUser) {
      // Error creating user
      throw Error("Error creating new user");
    }

    session.set("userId", createdUser.id);
    session.set("username", createdUser.username);
    return createdUser;
  }

  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!foundUser) {
    // Invalid user id
    throw Error("Invalid User ID");
  }

  session.set("userId", foundUser.id);
  session.set("username", foundUser.username);
  return foundUser;
};
