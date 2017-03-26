import io from 'socket.io-client';

/**
 * @class BrightsocketClient
 *
 * Contains all the functions we need for interfacing seamlessly
 * with a Brightsocket server.
 */
class BrightsocketClient {

  /**
   * @constructor
   *
   * Takes in a possible URI and instantiates the socket.io client lib.
   */
  constructor(location) {
    this.location = location;
    this.socket = this.location ? io(this.location) : io();
    this.hasSentIdentify = false;
    this.actions = [];
  }

  /**
   * Emits the identification action to Brightsocket on the server side.
   *
   * @param {String}       userType        - An arbitrary name for this user type.
   * @param {Serializable} optionalPayload - Any extra data to send in the identity package.
   * @param {Function}     callback        - Runs after we've been identified.
   *
   * @return {undefined}
   */
  connect(userType, optionalPayload, callback) {

    // Allow the middle argument to be optional.
    if (typeof optionalPayload === 'function') {
      callback = optionalPayload;
      optionalPayload = undefined;
    }

    // If we haven't yet tried to identify, send the identify action then
    // mark that we've identified.
    if (!this.hasSentIdentify) {
      const proxyPayload = optionalPayload ? Object.assign({}, optionalPayload) : {};
      proxyPayload["BRIGHTSOCKET:CHANNEL"] = userType;
      this.socket.emit('BRIGHTSOCKET:IDENTIFY', proxyPayload);
      callback && this.socket.on('BRIGHTSOCKET:IDENTIFIED', callback);
      this.hasSentIdentify = true;

    // If we've already identified or tried to identify once, mark that
    // back to false, disconnect, reconnect, then recursively call identify
    // again, thus allowing us to hit the first condition.
    } else {
      this.hasSentIdentify = false;
      this.socket.disconnect();
      this.socket = this.location ? io(this.location) : io();
      this.actions.forEach(actionTuple => {
        this.socket.on(actionTuple[0], actionTuple[1]);
      });
      this.connect.apply(this, arguments);
    }
  }

  /**
   * Handles an incoming action.
   *
   * @param {String}   action   - The name of the action.
   * @param {Function} callback - What to do with the payload.
   */
  receive(action, callback) {
    this.actions.push([action, callback]);
    return this.socket.on(action, callback);
  }

  /**
   * Handles sending an action to the server.
   *
   * @param {String}       action          - The name of the action.
   * @param {Serializable} optionalPayload - The payload to send.
   */
  send(action, optionalPayload) {
    return optionalPayload ? this.socket.emit(action, optionalPayload) : this.socket.emit(action);
  }

  /**
   * Manually disconnects the websocket, requiring re-identify.
   */
  disconnect() {
    this.hasSentIdentify = false;
    this.socket.disconnect();
  }

}

/**
 * Attach a function for instantiating brightsocket
 * to the window object.
 */
export default function brightsocket(location) {
  return new BrightsocketClient(location);
}
