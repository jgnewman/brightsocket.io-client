# brightsocket.io-client

This is the client side library for Brightsocket.io – a light abstraction over Socket.io for quickly building websocket APIs.

For more information on how to use Brightsocket.io, checkout [Brightsocket.io](https://www.npmjs.com/package/brightsocket.io) on the npm registry.

Here's how it works:

## 1. Brightsocket is a wrapper, so make sure you have socket.io-client.

Socket.io-client is a peer dependency. When you install brightsocket.io-client, it will not automatically install this for you so, if you didn't install this library via installing brightsocket.io, you'll need to make sure you manually install socket.io-client.

On the other hand, if you install socket.io and brightsocket.io, you will have automatically installed socket.io-client and brightsocket.io-client so you don't need to worry about it.

## 2. Require it into your clientside app.

Brightsocket does not expose new global variables. It will also import socket.io-client in such a way that the `io` global is not exposed. So pick your builder of choice and pull in Brightsocket like this:

```javascript
import brightsocket from 'brightsocket.io-client';

// or...

var brightsocket = require('brightsocket.io-client');
```

## 3. Launch Brightsocket and choose a channel on the server.

Brightsocket's server side expects every client side connection to identify a connection channel by keyword. This is not any kind of secret key or encrypted information. It simply tells the server which types of actions it can expect you to send since Brightsocket APIs can be partitioned based on these channels.

```javascript
const socket = brightsocket();
// By the way, if your server socket URI isn't local, you can pass it
// to the brightsocket function like `brightsocket(URI)`

socket.connect('USER', () => { ... });
// This keyword is essentially arbitrary. It just needs to match up
// with an identifier expected by the server. Once your connection
// has been hooked into a server channel, the callback function will
// run and you can hook up all your listeners in there.
```

## 4. Start sending and receiving actions.

Brightsocket's main message passing keywords are `send` and `receive`. Here's how you use them:

```javascript
// Pass some information to the server. It needs a name and a payload.
socket.send('UPDATE_USER_EMAIL', { email: 'fake@fake.com' });

// Handle incoming information from the server. You'll catch it by name
// and take the payload into a callback.
socket.receive('USER_INFO', payload => console.log(payload));
```

## 5. If you need to choose a new channel, just call `connect` again.

Any time you call `connect`, Brightsocket will check if you've already tried to connect in the past. If you have, it will close the connection then open a new connection and fire off your new identification info. This might be useful in a case where you originally choose a channel for unauthenticated users and pass in login credentials. A Brightsocket server might find your user in the database and then pass you back a token and a request to choose a new channel for authenticated users. You could then call `connect` once more and pass back your token, thus being assigned the correct socket API on the server side. Here's an example:

**On the client side**

```javascript
import brightsocket from 'brightsocket.io-client';

const socket = brightsocket();

const credentials = {
  username: 'fake@fake.com',
  password: 'password'
};

socket.connect('UNAUTHENTICATED', credentials, () => {

  socket.receive('LOGGED_IN', payload => {
    socket.connect(payload.userType, { token: payload.token }, () => {

      // Set up some more listeners and such

    });
  });

});
```

**On the server side**

```javascript
import http from 'http';
import express from 'express';
import brightsocket from 'brightsocket.io';
import db from 'YOUR_DB_MANAGER_OF_CHOICE';
import { makeToken, verifyToken } from 'YOUR_SESSION_MANAGER_OF_CHOICE';

const app = express();
const server = http.createServer(app);
const api = brightsocket(server);

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// When someone identifies as unknown, expect then to hand us a
// username and password. If it's valid, make a session token and
// let them know they're logged in.
api.connect('UNAUTHENTICATED', (connection, identity) => {
  db.get('users', identity).then(user => {
    const token = makeToken(user);
    user.token = token;
    connection.send('LOGGED_IN', user);
  });
});

// Whenever someone identifies as an admin, verify if they have
// a valid token.
api.connect('ADMIN', (connection, identity) => {
  if (verifyToken(identity.token)) {

    // Add a filter that forces authentication for every action on
    // this connection.
    connection.addFilter((action, payload, next) => {
      if (verifyToken(payload.token)) {
        next();
      } else {
        connection.send('UNAUTHORIZED');
      }
    });

    // Define the rest of your api here...
  }
});
```

And that's about it.
