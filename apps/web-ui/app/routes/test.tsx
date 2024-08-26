import { Button } from "@acme/ui";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useFetcher } from "@remix-run/react";
import { db, message } from "@acme/db";

export const meta: MetaFunction = () => {
  return [
    { title: "File Test" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function action({ request }: ActionFunctionArgs) {
  const [myMessage] = await db
    .insert(message)
    .values({ sender: "harris", body: "my message" })
    .returning();

  return json(myMessage);
}

export default function Test() {
  const fetcher = useFetcher();

  return (
    <div className="p-4 font-sans">
      {fetcher.state !== "idle" && <p>Loading</p>}
      <Button
        onClick={() => {
          fetcher.submit({}, { method: "POST" });
        }}
      >
        Send the file
      </Button>
      {fetcher.data && <p>Name: {fetcher.data.sender}</p>}
    </div>
  );
}
