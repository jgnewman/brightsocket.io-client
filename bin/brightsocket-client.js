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

    this.socket = location ? (0, _socket2.default)(location) : (0, _socket2.default)();
  }

  /**
   * Emits the identification action to Brightsocket on the server side.
   *
   * @param {String}       userType        - An arbitrary name for this user type.
   * @param {Serializable} optionalPayload - Any extra data to send in the identity package.
   *
   * @return {undefined}
   */


  _createClass(BrightsocketClient, [{
    key: 'identify',
    value: function identify(userType, optionalPayload) {
      var proxyPayload = optionalPayload ? Object.assign({}, optionalPayload) : {};
      proxyPayload["BRIGHTSOCKET:USERTYPE"] = userType;
      this.socket.emit('BRIGHTSOCKET:IDENTIFY', proxyPayload);
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