import { db, message } from "@acme/db";
import { ThermalPrinterService } from "@acme/proto/thermal_connect.js";
import { Button, Input } from "@acme/ui";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from "@acme/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Textarea } from "@acme/ui/textarea";
import { createPromiseClient } from "@connectrpc/connect";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
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
import { useState } from "react";

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
  sender: z.string().max(100, "Must be no more than 100 characters."),
  email: z.string().email("Must be a valid email").optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { data, error } = formSchema.safeParse(Object.fromEntries(formData));

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

export const loader = async () => {
  const messages = await db
    .select()
    .from(message)
    .orderBy(desc(message.createdAt))
    .limit(10);

  return json(messages);
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
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 font-sans">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="mb-4">
          <button className="outline-border w-full rounded-lg from-blue-300  to-yellow-300 p-4 text-center outline-dashed outline-1 hover:bg-gradient-to-r">
            + Send a new message
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Me a Message!</DialogTitle>
            <DialogDescription>
              Go ahead and send me a message, it will print out at my desk!
              Please keep in mind that all messages will be displayed publicly.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                (values: z.infer<typeof formSchema>) => {
                  fetcher.submit(values, { method: "POST" });
                  setOpen(false);
                },
              )}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="sender"
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
              {
                // <FormField
                //   control={form.control}
                //   name="email"
                //   render={({ field }) => (
                //     <FormItem>
                //       <FormLabel>Email</FormLabel>
                //       <FormControl>
                //         <Input placeholder="jdoe@mail.com" {...field} />
                //       </FormControl>
                //       <FormDescription>
                //         Optional. Only leave this if you're interested in a reply!
                //       </FormDescription>
                //       <FormMessage />
                //     </FormItem>
                //   )}
                // />
              }
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
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
                type="submit"
                disabled={["loading", "submitting"].includes(fetcher.state)}
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3">
        {data && data.map((message) => <MessageCard message={message} />)}
      </div>
    </div>
  );
}
