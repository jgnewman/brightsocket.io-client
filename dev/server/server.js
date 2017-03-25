import express from 'express';
import http from 'http';
import path from 'path';

const app = express();
const server = http.Server(app);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client/index.html'));
});

app.get('/app.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client/app.js'));
});

export default server;
