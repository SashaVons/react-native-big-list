import React, { memo } from "react";
import PropTypes from "prop-types";
import { Animated } from "react-native";
import { mergeViewStyle } from "./utils";
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
  const child = React.Children.only(children);
  const fillChildren =
    /*#__PURE__*/ React.isValidElement(child) &&
    /*#__PURE__*/ React.cloneElement(
      child,
      mergeViewStyle(style, {
        style: {
          flex: 1,
        },
      })
    );
  const viewStyle = [
    /*#__PURE__*/ React.isValidElement(child) && child.props.style
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
  return /*#__PURE__*/ React.createElement(
    Animated.View,
    {
      style: viewStyle,
    },
    fillChildren
  );
};

BigListSection.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  height: PropTypes.number,
  nextSectionPosition: PropTypes.number,
  position: PropTypes.number,
  scrollTopValue: PropTypes.instanceOf(Animated.Value),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
export default /*#__PURE__*/ memo(BigListSection);
//# sourceMappingURL=BigListSection.js.map
