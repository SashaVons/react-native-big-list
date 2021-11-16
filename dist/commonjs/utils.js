"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.createElement =
  exports.mergeViewStyle =
  exports.autobind =
  exports.processBlock =
  exports.isNumeric =
    void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Is numeric.
 * @param {any} num
 * @returns {boolean}
 */
const isNumeric = (num) => {
  return !isNaN(parseFloat(num)) && isFinite(num);
};
/**
 * Process block.
 * @param {number} containerHeight
 * @param {number} scrollTop
 * @param {number|null|undefined} batchSizeThreshold
 * @returns {{blockStart: number, batchSize: number, blockEnd: number}}
 */
exports.isNumeric = isNumeric;

const processBlock = ({
  containerHeight,
  scrollTop,
  batchSizeThreshold = 1,
}) => {
  if (containerHeight === 0) {
    return {
      batchSize: 0,
      blockStart: 0,
      blockEnd: 0,
    };
  }

  const batchSize = Math.ceil(
    containerHeight * Math.max(0.5, batchSizeThreshold)
  );
  const blockNumber = Math.ceil(scrollTop / batchSize);
  const blockStart = batchSize * blockNumber;
  const blockEnd = blockStart + batchSize;
  return {
    batchSize,
    blockStart,
    blockEnd,
  };
};
/**
 * Autobind context to class methods.
 * @param {object} self
 * @returns {{}}
 */
exports.processBlock = processBlock;

const autobind = (self = {}) => {
  const exclude = [
    "componentWillMount",
    "UNSAFE_componentWillMount",
    "render",
    "getSnapshotBeforeUpdate",
    "componentDidMount",
    "componentWillReceiveProps",
    "UNSAFE_componentWillReceiveProps",
    "shouldComponentUpdate",
    "componentWillUpdate",
    "UNSAFE_componentWillUpdate",
    "componentDidUpdate",
    "componentWillUnmount",
    "componentDidCatch",
    "setState",
    "forceUpdate",
  ];

  const filter = (key) => {
    const match = (pattern) =>
      typeof pattern === "string" ? key === pattern : pattern.test(key);

    if (exclude) {
      return !exclude.some(match);
    }

    return true;
  };

  const getAllProperties = (object) => {
    const properties = new Set();

    do {
      for (const key of Object.getOwnPropertyNames(object).concat(
        Object.getOwnPropertySymbols(object)
      )) {
        properties.add([object, key]);
      }
    } while (
      (object = Object.getPrototypeOf(object)) &&
      object !== Object.prototype
    );

    return properties;
  };

  for (const [object, key] of getAllProperties(self.constructor.prototype)) {
    if (key === "constructor" || !filter(key)) {
      continue;
    }

    const descriptor = Object.getOwnPropertyDescriptor(object, key);

    if (descriptor && typeof descriptor.value === "function") {
      self[key] = self[key].bind(self);
    }
  }

  return self;
};
/**
 * Merge styles
 * @param {array|object|null|undefined} style
 * @param {array|object} defaultStyle
 * @returns {Object}
 */
exports.autobind = autobind;

const mergeViewStyle = (style, defaultStyle = {}) => {
  let mergedStyle = style;

  if (mergedStyle == null) {
    mergedStyle = defaultStyle;
  } else if (Array.isArray(style) && Array.isArray(defaultStyle)) {
    const mergedDefaultStyle = [...defaultStyle];
    mergedDefaultStyle.concat(style);
    mergedStyle = mergedDefaultStyle;
  } else if (Array.isArray(defaultStyle)) {
    const mergedDefaultStyle = [...defaultStyle];
    mergedDefaultStyle.push(style);
    mergedStyle = mergedDefaultStyle;
  } else if (Array.isArray(style)) {
    mergedStyle = [...style];
    mergedStyle.unshift(defaultStyle);
  } else {
    mergedStyle = [defaultStyle, style];
  }

  return mergedStyle;
};
/**
 * Get element from component.
 * @param {React.node} Component
 * @returns {JSX.Element|[]|*}
 */
exports.mergeViewStyle = mergeViewStyle;

const createElement = (Component) => {
  return Component != null
    ? /*#__PURE__*/ _react.default.isValidElement(Component)
      ? Component
      : /*#__PURE__*/ _react.default.createElement(Component, null)
    : null;
};

exports.createElement = createElement;
//# sourceMappingURL=utils.js.map
