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

/**
 * List section.
 * @param {object|array} style
 * @param {number} position
 * @param {number} height
 * @param {number} nextSectionPosition
 * @param {Animated.Value} scrollTopValue
 * @param {React.node} children
 * @returns {JSX.Element}
 * @constructor
 */
const BigListSection = ({
  style,
  position,
  height,
  nextSectionPosition,
  scrollTopValue,
  children,
}) => {
  const inputRange = [-1, 0];
  const outputRange = [0, 0];
  inputRange.push(position);
  outputRange.push(0);
  const collisionPoint = (nextSectionPosition || 0) - height;

  if (collisionPoint >= position) {
    inputRange.push(collisionPoint, collisionPoint + 1);
    outputRange.push(collisionPoint - position, collisionPoint - position);
  } else {
    inputRange.push(position + 1);
    outputRange.push(1);
  }

  const translateY = scrollTopValue.interpolate({
    inputRange,
    outputRange,
  });

  const child = _react.default.Children.only(children);

  const fillChildren =
    /*#__PURE__*/ _react.default.isValidElement(child) &&
    /*#__PURE__*/ _react.default.cloneElement(
      child,
      (0, _utils.mergeViewStyle)(style, {
        style: {
          flex: 1,
        },
      })
    );

  const viewStyle = [
    /*#__PURE__*/ _react.default.isValidElement(child) && child.props.style
      ? child.props.style
      : style,
    {
      elevation: 0,
      zIndex: 10,
      height: height,
      width: "100%",
      transform: [
        {
          translateY,
        },
      ],
    },
  ];
  return /*#__PURE__*/ _react.default.createElement(
    _reactNative.Animated.View,
    {
      style: viewStyle,
    },
    fillChildren
  );
};

BigListSection.propTypes = {
  children: _propTypes.default.oneOfType([
    _propTypes.default.arrayOf(_propTypes.default.node),
    _propTypes.default.node,
  ]),
  height: _propTypes.default.number,
  nextSectionPosition: _propTypes.default.number,
  position: _propTypes.default.number,
  scrollTopValue: _propTypes.default.instanceOf(_reactNative.Animated.Value),
  style: _propTypes.default.oneOfType([
    _propTypes.default.object,
    _propTypes.default.array,
  ]),
};

var _default = /*#__PURE__*/ (0, _react.memo)(BigListSection);

exports.default = _default;
//# sourceMappingURL=BigListSection.js.map
