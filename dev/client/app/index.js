import brightsocket from './brightsocket-client';

console.log('brightsocket exists', typeof brightsocket === 'function');

const socket = brightsocket();

socket.identify('USER1');

socket.receive('NEEDS_REIDENTIFY', () => {
  socket.identify('USER2');
  socket.send('MESSAGE');
});
