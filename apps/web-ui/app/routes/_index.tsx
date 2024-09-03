import { db, message, user } from "@acme/db";
import { ThermalPrinterService } from "@acme/proto/thermal_connect.js";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@acme/ui";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@acme/ui/form";
import { Textarea } from "@acme/ui/textarea";
import { createPromiseClient } from "@connectrpc/connect";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import {
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { desc, eq } from "drizzle-orm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MessageCard } from "~/components";
import { grpcTransport } from "~/test.server";
import anyAscii from "any-ascii";
import moment from "moment";
import { commitSession, getSession } from "~/sessions";
import { getOrCreateUser } from "~/helpers/getOrCreateUser.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Send Harris a Message" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const formSchema = z.object({
  body: z
    .string()
    .min(2, { message: "Must be at least 2 characters." })
    .max(750, "Must be no more than 750 characters."),
  username: z.string().max(100, "Must be no more than 100 characters."),
  email: z.string().email("Must be a valid email").optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { data, error } = formSchema.safeParse(Object.fromEntries(formData));

  if (!data) {
    throw json(error, { status: 400 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const user = await getOrCreateUser(session, data.username);

  // Create message in the DB
  const [myMessage] = await db
    .insert(message)
    .values({ ...data, senderId: user.id })
    .returning();

  if (!myMessage) {
    throw json(Error("Failed to create db entry"), { status: 500 });
  }

  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "production") {
    const client = createPromiseClient(ThermalPrinterService, grpcTransport);
    await client.printText({
      body: anyAscii(data.body),
      sender: user.username,
      timeStamp: moment(myMessage.createdAt).format("M/D/YY [at] h:mmA"),
    });
  }

  await db
    .update(message)
    .set({ printedAt: new Date() })
    .where(eq(message.id, myMessage.id));

  return json(
    { message: myMessage },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return json({ messages: [], username: undefined });
  }

  const messages = await db
    .select()
    .from(message)
    .leftJoin(user, eq(user.id, message.senderId))
    .where(eq(message.senderId, userId))
    .orderBy(desc(message.createdAt))
    .limit(10);

  return json({ messages, username: session.get("username") });
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <p>
        Error: {error.status}. Status: {error.statusText}
      </p>
    );
  } else if (error instanceof Error) {
    return <p>Error: {error.message}</p>;
  } else {
    return <>{children}</>;
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const username = form.watch("username");

  return (
    <div className="p-4 font-sans">
      <Card className="mb-6 p-4">
        <CardHeader>
          <CardTitle>Send Me a Message!</CardTitle>
          <CardDescription>
            Go ahead and send me a message, it will print out at my desk!
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (values: z.infer<typeof formSchema>) => {
                fetcher.submit(values, { method: "POST" });
                // Reset the form values
                form.reset({ username, body: "" });
              },
            )}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="username"
              defaultValue={data.username}
              disabled={!!data.username}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Send me a message!"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="outline-border w-full rounded-lg from-blue-300  to-yellow-300 p-4 text-center outline-dashed outline-1 hover:bg-gradient-to-r"
              type="submit"
              disabled={["loading", "submitting"].includes(fetcher.state)}
            >
              Send Harris a Message!
            </Button>
          </form>
        </Form>
      </Card>
      <div className="flex flex-col gap-3">
        {data.messages.map(({ messages, users }) => (
          <MessageCard message={messages} user={users} />
        ))}
        {data.messages.length <= 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>You Haven't Sent Any Messages (Yet)</CardTitle>
              <CardDescription>
                Use the form above to send me your first message!
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
