import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  transports: ['websocket', 'polling']
});

// Add some debugging and status logging
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;