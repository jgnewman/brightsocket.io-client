'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = brightsocket;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class BrightsocketClient
 *
 * Contains all the functions we need for interfacing seamlessly
 * with a Brightsocket server.
 */
var BrightsocketClient = function () {

  /**
   * @constructor
   *
   * Takes in a possible URI and instantiates the socket.io client lib.
   */
  function BrightsocketClient(location) {
    _classCallCheck(this, BrightsocketClient);

    this.location = location;
    this.socket = this.location ? (0, _socket2.default)(this.location) : (0, _socket2.default)();
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


  _createClass(BrightsocketClient, [{
    key: 'connect',
    value: function connect(userType, optionalPayload, callback) {
      var _this = this;

      // Allow the middle argument to be optional.
      if (typeof optionalPayload === 'function') {
        callback = optionalPayload;
        optionalPayload = undefined;
      }

      // If we haven't yet tried to identify, send the identify action then
      // mark that we've identified.
      if (!this.hasSentIdentify) {
        var proxyPayload = optionalPayload ? Object.assign({}, optionalPayload) : {};
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
        this.socket = this.location ? (0, _socket2.default)(this.location) : (0, _socket2.default)();
        this.actions.forEach(function (actionTuple) {
          _this.socket.on(actionTuple[0], actionTuple[1]);
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

  }, {
    key: 'receive',
    value: function receive(action, callback) {
      this.actions.push([action, callback]);
      return this.socket.on(action, callback);
    }

    /**
     * Handles sending an action to the server.
     *
     * @param {String}       action          - The name of the action.
     * @param {Serializable} optionalPayload - The payload to send.
     */

  }, {
    key: 'send',
    value: function send(action, optionalPayload) {
      return optionalPayload ? this.socket.emit(action, optionalPayload) : this.socket.emit(action);
    }

    /**
     * Manually disconnects the websocket, requiring re-identify.
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.hasSentIdentify = false;
      this.socket.disconnect();
    }
  }]);

  return BrightsocketClient;
}();

/**
 * Attach a function for instantiating brightsocket
 * to the window object.
 */


function brightsocket(location) {
  return new BrightsocketClient(location);
}