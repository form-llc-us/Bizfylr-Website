type ReadableRequest = AsyncIterable<unknown> & {
  destroyed?: boolean;
  headers: Record<string, string | string[] | undefined>;
};

export const BODY_LIMITS = {
  standardJson: 128 * 1024,
  blogJson: 1024 * 1024,
  webhook: 1024 * 1024,
  imageUpload: 10 * 1024 * 1024
} as const;

export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 400 | 413 | 415
  ) {
    super(message);
    this.name = "RequestBodyError";
  }
}

function normalizedContentType(request: ReadableRequest) {
  const header = request.headers["content-type"];
  const value = Array.isArray(header) ? header[0] ?? "" : header ?? "";
  return value.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}

function assertAllowedContentType(request: ReadableRequest, allowed: readonly string[]) {
  const contentType = normalizedContentType(request);
  const accepted = allowed.some((value) =>
    value === "application/*+json"
      ? contentType.startsWith("application/") && contentType.endsWith("+json")
      : value.endsWith("/*")
        ? contentType.startsWith(value.slice(0, -1))
        : contentType === value
  );

  if (!accepted) {
    throw new RequestBodyError("Unsupported content type.", 415);
  }
}

export async function readRawRequestBody(
  request: ReadableRequest,
  input: { limitBytes: number; allowedContentTypes?: readonly string[] }
) {
  if (input.allowedContentTypes) {
    assertAllowedContentType(request, input.allowedContentTypes);
  }

  const contentLengthHeader = request.headers["content-length"];
  const contentLength = typeof contentLengthHeader === "string" ? Number(contentLengthHeader) : 0;

  if (Number.isFinite(contentLength) && contentLength > input.limitBytes) {
    throw new RequestBodyError("Request body is too large.", 413);
  }

  const chunks: Buffer[] = [];
  let receivedBytes = 0;

  try {
    for await (const chunk of request) {
      if (!Buffer.isBuffer(chunk) && typeof chunk !== "string" && !(chunk instanceof Uint8Array)) {
        throw new RequestBodyError("Request body contained an unsupported stream chunk.", 400);
      }
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      receivedBytes += buffer.length;

      if (receivedBytes > input.limitBytes) {
        throw new RequestBodyError("Request body is too large.", 413);
      }

      chunks.push(buffer);
    }
  } catch (error) {
    if (error instanceof RequestBodyError) {
      throw error;
    }

    throw new RequestBodyError(
      request.destroyed ? "Request body stream was aborted." : "Unable to read request body.",
      400
    );
  }

  return Buffer.concat(chunks, receivedBytes);
}

export async function readJsonRequest(request: ReadableRequest, limitBytes: number): Promise<unknown> {
  const body = await readRawRequestBody(request, {
    limitBytes,
    allowedContentTypes: ["application/json", "application/*+json"]
  });

  if (body.length === 0) {
    return {};
  }

  try {
    return JSON.parse(body.toString("utf8")) as unknown;
  } catch {
    throw new RequestBodyError("Request body contains malformed JSON.", 400);
  }
}
