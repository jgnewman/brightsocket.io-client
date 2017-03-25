import express from 'express';
import http from 'http';
import path from 'path';
import brightsocket from 'brightsocket.io';


const app = express();
const server = http.Server(app);
const api = brightsocket(server);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client/index.html'));
});

app.get('/app.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client/app.js'));
});

api.identify('USER1', connection => {
  console.log('Identified user type 1');
  connection.send('NEEDS_REIDENTIFY', 'USER2');
  connection.receive('MESSAGE', () => console.log('You should never see this'));
});

api.identify('USER2', connection => {
  console.log('Identified user type 2');
  connection.receive('MESSAGE', () => console.log('Successfully re-identified'));
});

export default server;
