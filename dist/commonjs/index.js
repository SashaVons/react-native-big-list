"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _reactNative = require("react-native");

var _BigList = _interopRequireDefault(require("./BigList"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _default = _reactNative.Animated.createAnimatedComponent(_BigList.default);

exports.default = _default;
//# sourceMappingURL=index.js.map
