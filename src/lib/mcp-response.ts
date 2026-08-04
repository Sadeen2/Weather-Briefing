export function createJsonTextResponse(result: unknown): {
  content: Array<{ type: "text"; text: string }>;
} {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

export function createSafeErrorResponse(message: string): {
  content: Array<{ type: "text"; text: string }>;
} {
  return createJsonTextResponse({ message });
}
