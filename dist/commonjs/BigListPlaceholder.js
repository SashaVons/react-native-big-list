"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

var _utils = require("./utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

const BigListPlaceholder = ({
  component,
  image,
  style,
  height,
  width = "100%",
}) => {
  const bgStyles = {
    position: "absolute",
    resizeMode: "repeat",
    overflow: "visible",
    backfaceVisibility: "visible",
    flex: 1,
    height: "100%",
    width: "100%",
  };
  return /*#__PURE__*/ _react.default.createElement(
    _reactNative.Animated.View,
    {
      style: (0, _utils.mergeViewStyle)(style, {
        height,
        width,
      }),
    },
    (0, _utils.createElement)(component) ||
      /*#__PURE__*/ _react.default.createElement(_reactNative.Image, {
        source: image || require("./assets/placeholder.png"),
        style: bgStyles,
      })
  );
};

BigListPlaceholder.propTypes = {
  height: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
  ]),
  width: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
  ]),
  style: _propTypes.default.oneOfType([
    _propTypes.default.object,
    _propTypes.default.array,
  ]),
};
BigListPlaceholder.defaultProps = {
  width: "100%",
};

var _default = /*#__PURE__*/ (0, _react.memo)(BigListPlaceholder);

exports.default = _default;
//# sourceMappingURL=BigListPlaceholder.js.map
