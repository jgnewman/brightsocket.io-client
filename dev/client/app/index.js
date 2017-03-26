import brightsocket from './brightsocket-client';

console.log('brightsocket exists', typeof brightsocket === 'function');

const socket = brightsocket();

socket.connect('USER1', () => {

  socket.receive('NEEDS_REIDENTIFY', () => {
    socket.connect('USER2');
    socket.send('MESSAGE');
  });

});
