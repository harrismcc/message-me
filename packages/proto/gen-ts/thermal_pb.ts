// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file thermal.proto (package thermal, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message thermal.Empty
 */
export class Empty extends Message<Empty> {
  constructor(data?: PartialMessage<Empty>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "thermal.Empty";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Empty {
    return new Empty().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Empty {
    return new Empty().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Empty {
    return new Empty().fromJsonString(jsonString, options);
  }

  static equals(a: Empty | PlainMessage<Empty> | undefined, b: Empty | PlainMessage<Empty> | undefined): boolean {
    return proto3.util.equals(Empty, a, b);
  }
}

/**
 * @generated from message thermal.ImageFileResponse
 */
export class ImageFileResponse extends Message<ImageFileResponse> {
  /**
   * @generated from field: bytes chunk_data = 2;
   */
  chunkData = new Uint8Array(0);

  constructor(data?: PartialMessage<ImageFileResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "thermal.ImageFileResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "chunk_data", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ImageFileResponse {
    return new ImageFileResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ImageFileResponse {
    return new ImageFileResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ImageFileResponse {
    return new ImageFileResponse().fromJsonString(jsonString, options);
  }

  static equals(a: ImageFileResponse | PlainMessage<ImageFileResponse> | undefined, b: ImageFileResponse | PlainMessage<ImageFileResponse> | undefined): boolean {
    return proto3.util.equals(ImageFileResponse, a, b);
  }
}

/**
 * @generated from message thermal.PrintTextRequest
 */
export class PrintTextRequest extends Message<PrintTextRequest> {
  /**
   * The name of the message sender
   *
   * @generated from field: string sender = 1;
   */
  sender = "";

  /**
   * The location of the sender
   *
   * @generated from field: optional string location = 2;
   */
  location?: string;

  /**
   * The message body
   *
   * @generated from field: string body = 3;
   */
  body = "";

  constructor(data?: PartialMessage<PrintTextRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "thermal.PrintTextRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "sender", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "location", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 3, name: "body", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PrintTextRequest {
    return new PrintTextRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PrintTextRequest {
    return new PrintTextRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PrintTextRequest {
    return new PrintTextRequest().fromJsonString(jsonString, options);
  }

  static equals(a: PrintTextRequest | PlainMessage<PrintTextRequest> | undefined, b: PrintTextRequest | PlainMessage<PrintTextRequest> | undefined): boolean {
    return proto3.util.equals(PrintTextRequest, a, b);
  }
}

/**
 * @generated from message thermal.PrintResponse
 */
export class PrintResponse extends Message<PrintResponse> {
  /**
   * @generated from field: bool success = 1;
   */
  success = false;

  constructor(data?: PartialMessage<PrintResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "thermal.PrintResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "success", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PrintResponse {
    return new PrintResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PrintResponse {
    return new PrintResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PrintResponse {
    return new PrintResponse().fromJsonString(jsonString, options);
  }

  static equals(a: PrintResponse | PlainMessage<PrintResponse> | undefined, b: PrintResponse | PlainMessage<PrintResponse> | undefined): boolean {
    return proto3.util.equals(PrintResponse, a, b);
  }
}

