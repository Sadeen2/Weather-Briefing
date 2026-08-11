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
  isError: true;
  content: Array<{ type: "text"; text: string }>;
} {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({ message }, null, 2),
      },
    ],
  };
}