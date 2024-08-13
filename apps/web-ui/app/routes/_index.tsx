import { ThermalPrinterService } from "@acme/proto/thermal_connect.js";
import { Button, Input } from "@acme/ui";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@acme/ui/form";
import { Textarea } from "@acme/ui/textarea";
import { createPromiseClient } from "@connectrpc/connect";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { grpcTransport } from "~/test.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = formData.get("body");

  if (!body) {
    throw json("No body found in input", { status: 400 });
  }

  const client = createPromiseClient(ThermalPrinterService, grpcTransport);
  const res = await client.printText({ body: body as string });

  return json(res);
}

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

const formSchema = z.object({
  body: z
    .string()
    .min(2, { message: "Must be at least 2 characters." })
    .max(500, "Must be no more that 500 characters."),
});

export default function Index() {
  const fetcher = useFetcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="p-4 font-sans">
      <Button
        onClick={() => {
          fetcher.submit(
            {
              body: "This is some text from remix",
            },
            { method: "POST" },
          );
        }}
      >
        Hello
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) => {
            fetcher.submit(values, { method: "POST" });
          })}
          className="space-y-8"
        >
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
    </div>
  );
}
