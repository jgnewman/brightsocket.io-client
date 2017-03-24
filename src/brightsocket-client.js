import 'socket.io-client';

class BrightSocketClient {

  constructor(location) {
    this.socket = location ? io(location) : io();
  }

  identify(userType, optionalPayload) {
    const proxyPayload = optionalPayload ? Object.assign({}, optionalPayload) : {};
    proxyPayload["BRIGHTSOCKET_INTERNAL:USERTYPE"] = userType;
    this.socket.emit('BRIGHTSOCKET_INTERNAL:IDENTIFY', proxyPayload);
  }

  receive(action, callback) {
    return this.socket.on(action, callback);
  }

  send(action, optionalPayload) {
    return optionalPayload ? this.socket.emit(action, optionalPayload) : this.socket.emit(action);
  }

}

window.brightsocket = function(location) {
  return new BrightSocketClient(location);
}
