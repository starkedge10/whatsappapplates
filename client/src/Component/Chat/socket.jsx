import { io } from 'socket.io-client';

const socket = io('https://whatsappchatbox-93c2adc302d2.herokuapp.com/', {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
