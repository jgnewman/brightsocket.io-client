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
    this.socket = location ? io(location) : io();
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
    const proxyPayload = optionalPayload ? Object.assign({}, optionalPayload) : {};
    proxyPayload["BRIGHTSOCKET_INTERNAL:USERTYPE"] = userType;
    this.socket.emit('BRIGHTSOCKET_INTERNAL:IDENTIFY', proxyPayload);
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
