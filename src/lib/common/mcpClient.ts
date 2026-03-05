let es: EventSource | null = null;

export function connectToMCP(onEvent: (type: string, data: any) => void) {
  if (es) return es;

  es = new EventSource("http://localhost:8000/sse");

  es.onopen = () => console.log("SSE connected");

  es.onerror = (err) => console.error("SSE error", err);

  es.onmessage = (ev) => onEvent("message", ev.data);

  es.addEventListener("endpoint", (ev) => onEvent("endpoint", ev.data));

  return es;
}
