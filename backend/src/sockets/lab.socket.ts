import { Server, Socket } from 'socket.io';

export function setupLabSockets(io: Server) {
  const labNamespace = io.of('/lab');

  labNamespace.on('connection', (socket: Socket) => {
    console.log(`Lab connected: ${socket.id}`);

    socket.on('lab:join', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('lab:sync', { message: `User ${socket.id} joined.` });
    });

    socket.on('lab:cursor', (data) => {
      socket.to(data.roomId).emit('lab:cursor', { id: socket.id, ...data });
    });

    socket.on('lab:object-move', (data) => {
      socket.to(data.roomId).emit('lab:object-move', data);
    });

    socket.on('lab:leave', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('lab:sync', { message: `User ${socket.id} left.` });
    });

    socket.on('disconnect', () => {
      console.log(`Lab disconnected: ${socket.id}`);
    });
  });
}
