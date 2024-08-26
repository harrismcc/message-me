import { db, message } from "@acme/db";
import { ThermalPrinterService } from "@acme/proto/thermal_connect.js";
import { createPromiseClient } from "@connectrpc/connect";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno

import { eq } from "drizzle-orm";
import { z } from "zod";
import { grpcTransport } from "~/test.server";

const formSchema = z.object({
  body: z
    .string()
    .min(2, { message: "Must be at least 2 characters." })
    .max(750, "Must be no more than 750 characters."),
  sender: z.string().max(100, "Must be no more than 100 characters."),
  email: z.string().email("Must be a valid email").optional(),
});

export const loader = () => {
  throw json(Error("GET not supported for this route"), { status: 404 });
};

export async function action({ request }: ActionFunctionArgs) {
  const inputData = (await request.json()) as unknown;
  const { data, error } = formSchema.safeParse(inputData);

  if (!data) {
    throw json(error, { status: 400 });
  }

  // Create message in the DB
  const [myMessage] = await db
    .insert(message)
    .values({ ...data })
    .returning();

  if (!myMessage) {
    throw json(Error("Failed to create db entry"), { status: 500 });
  }

  const client = createPromiseClient(ThermalPrinterService, grpcTransport);
  const res = await client.printText({ body: data.body, sender: data.sender });

  await db
    .update(message)
    .set({ printedAt: new Date() })
    .where(eq(message.id, myMessage.id));

  return json({ message: myMessage, response: res });
}
