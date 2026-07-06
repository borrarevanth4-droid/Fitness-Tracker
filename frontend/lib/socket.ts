import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let labSocket: Socket | null = null;
let notifySocket: Socket | null = null;

export const getLabSocket = () => {
  if (!labSocket) {
    labSocket = io(`${SOCKET_URL}/lab`, { transports: ['websocket'] });
  }
  return labSocket;
};

export const getNotifySocket = () => {
  if (!notifySocket) {
    notifySocket = io(`${SOCKET_URL}/notify`, { transports: ['websocket'] });
  }
  return notifySocket;
};

export const disconnectSockets = () => {
  if (labSocket) labSocket.disconnect();
  if (notifySocket) notifySocket.disconnect();
  labSocket = null;
  notifySocket = null;
};
