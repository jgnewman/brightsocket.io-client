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
  }

  /**
   * Emits the identification action to Brightsocket on the server side.
   *
   * @param {String}       userType        - An arbitrary name for this user type.
   * @param {Serializable} optionalPayload - Any extra data to send in the identity package.
   *
   * @return {undefined}
   */
  identify(userType, optionalPayload) {

    // If we haven't yet tried to identify, send the identify action then
    // mark that we've identified.
    if (!this.hasSentIdentify) {
      const proxyPayload = optionalPayload ? Object.assign({}, optionalPayload) : {};
      proxyPayload["BRIGHTSOCKET:USERTYPE"] = userType;
      this.socket.emit('BRIGHTSOCKET:IDENTIFY', proxyPayload);
      this.hasSentIdentify = true;

    // If we've already identified or tried to identify once, mark that
    // back to false, disconnect, reconnect, then recursively call identify
    // again, thus allowing us to hit the first condition.
    } else {
      this.hasSentIdentify = false;
      this.socket.disconnect();
      this.socket = this.location ? io(this.location) : io();
      this.identify(userType, optionalPayload);
    }
  }

  /**
   * Handles an incoming action.
   *
   * @param {String}   action   - The name of the action.
   * @param {Function} callback - What to do with the payload.
   */
  receive(action, callback) {
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

}

/**
 * Attach a function for instantiating brightsocket
 * to the window object.
 */
export default function brightsocket(location) {
  return new BrightsocketClient(location);
}
