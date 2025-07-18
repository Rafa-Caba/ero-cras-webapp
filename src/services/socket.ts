import io from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:10000', {
    transports: ['websocket'],
    autoConnect: true,
});

// (socket as any).onAny((event: string, ...args: any[]) => {
//     console.log(`📡 Recibido evento socket: ${event}`, args);
// });
