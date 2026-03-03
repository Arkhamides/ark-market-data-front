// src/lib/websocket.ts
let socket: WebSocket;
let listeners: ((data: any) => void)[] = [];

export function connectWebSocket(url: string = 'ws://127.0.0.1:9002') {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connected');
    socket.send(JSON.stringify({ event: 'subscribe_aggregated_market' }));
    console.log('Sent subscription request');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach((cb) => cb(data));
    } catch (err) {
      console.error('Failed to parse message', event.data);
    }
  };

  socket.onerror = (err) => console.error('WebSocket error', err);
  socket.onclose = () => console.log('WebSocket closed');
}

export function subscribe(callback: (data: any) => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}
