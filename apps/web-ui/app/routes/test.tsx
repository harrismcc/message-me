import { ThermalPrinterService } from "@acme/proto/thermal_connect.js";
import { Button } from "@acme/ui";
import { createPromiseClient } from "@connectrpc/connect";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useFetcher } from "@remix-run/react";
import { grpcTransport } from "~/test.server";
import fs from "fs";

export const meta: MetaFunction = () => {
  return [
    { title: "File Test" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function action({ request }: ActionFunctionArgs) {
  const client = createPromiseClient(ThermalPrinterService, grpcTransport);
  const resStream = client.takePicture({});
  const writeStream = fs.createWriteStream("/tmp/1GB.bin");

  for await (const response of resStream) {
    writeStream.write(response.chunkData);
  }
  writeStream.end();

  return json({});
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
    </div>
  );
}
