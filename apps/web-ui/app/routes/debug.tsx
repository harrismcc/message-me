import { Button } from "@acme/ui";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { destroySession, getSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "production") {
    // Only use this page in dev
    redirect("/");
  }

  const session = await getSession(request.headers.get("Cookie"));

  return json({ session: session });
};

export default function Debug() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Debug Page</h1>
      {JSON.stringify(data)}
      <Form method="post">
        <Button>Logout User Session</Button>
      </Form>
    </div>
  );
}
