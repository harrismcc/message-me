import { createGrpcTransport } from "@connectrpc/connect-node";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { env } from "./env.server";

/**
 * The connectRPC transport, used to create gRPC clients.
 * @see https://connectrpc.com
 *
 */
export const grpcTransport = createGrpcTransport({
  baseUrl: env.THERMAL_PRINTER_GRPC,
  httpVersion: "2",
});
