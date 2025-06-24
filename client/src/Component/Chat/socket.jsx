import { io } from 'socket.io-client';

const socket = io('https://clone-webchat.onrender.com/', {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
