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

## 3. Launch Brightsocket and identify yourself to the server.

Brightsocket's server side expects every client side connection to identify itself by keyword. This is not any kind of secret key or encrypted information. It simply tells the server which types of actions it can expect you to send since Brightsocket APIs can be partitioned based on these keywords.

```javascript
const socket = brightsocket();
// By the way, if your server socket URI isn't local, you can pass it
// to the brightsocket function like `brightsocket(URI)`

socket.identify('USER');
// This keyword is essentially arbitrary. It just needs to match up
// with an identifier expected by the server.
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

And that's about it.
