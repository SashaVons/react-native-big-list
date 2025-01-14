import React, { memo } from "react";
import PropTypes from "prop-types";
import { Animated, Image } from "react-native";
import { createElement, mergeViewStyle } from "./utils";

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
  return /*#__PURE__*/ React.createElement(
    Animated.View,
    {
      style: mergeViewStyle(style, {
        height,
        width,
      }),
    },
    createElement(component) ||
      /*#__PURE__*/ React.createElement(Image, {
        source: image || require("./assets/placeholder.png"),
        style: bgStyles,
      })
  );
};

BigListPlaceholder.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
BigListPlaceholder.defaultProps = {
  width: "100%",
};
export default /*#__PURE__*/ memo(BigListPlaceholder);
//# sourceMappingURL=BigListPlaceholder.js.map
