"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

var _BigListItem = _interopRequireWildcard(require("./BigListItem"));

var _BigListPlaceholder = _interopRequireDefault(
  require("./BigListPlaceholder")
);

var _BigListProcessor = _interopRequireDefault(require("./BigListProcessor"));

var _BigListSection = _interopRequireDefault(require("./BigListSection"));

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

class BigList extends _react.PureComponent {
  /**
   * Constructor.
   * @param props
   */
  constructor(props) {
    super(props);
    (0, _utils.autobind)(this); // Initialize properties and state

    this.containerHeight = 0;
    this.scrollTop = 0;
    this.scrollTopValue =
      this.props.initialScrollIndex || new _reactNative.Animated.Value(0);
    this.scrollView = /*#__PURE__*/ _react.default.createRef();
    this.state = this.getListState();
    this.viewableItems = [];
  }
  /**
   * Get list state.
   * @param {array} data
   * @param {array[]|object|null|undefined} sections
   * @param {array} prevItems
   * @param {number|null} batchSizeThreshold
   * @param {number|function|null|undefined} headerHeight
   * @param {number|function|null|undefined} footerHeight
   * @param {number|function|null|undefined} sectionHeaderHeight
   * @param {number|function|null|undefined} itemHeight
   * @param {number|function|null|undefined} sectionFooterHeight
   * @param {number|null|undefined} insetTop
   * @param {number|null|undefined} insetBottom
   * @param {number|null|undefined} numColumns
   * @param {number|null|undefined} batchSize
   * @param {number|null|undefined} blockStart
   * @param {number|null|undefined} blockEnd
   * @param {function|null|undefined} getItemLayout
   * @returns {{blockStart: *, batchSize: *, blockEnd: *, items: [], height: *}|{blockStart, batchSize, blockEnd, items: [], height: *}}
   */
  static getListState(
    {
      data,
      sections,
      batchSizeThreshold,
      headerHeight,
      footerHeight,
      sectionHeaderHeight,
      itemHeight,
      sectionFooterHeight,
      insetTop,
      insetBottom,
      numColumns,
      getItemLayout,
    },
    { batchSize, blockStart, blockEnd, items: prevItems }
  ) {
    if (batchSize === 0) {
      return {
        batchSize,
        blockStart,
        blockEnd,
        height: insetTop + insetBottom,
        items: [],
      };
    }

    const self = BigList;
    const layoutItemHeight = self.getItemHeight(itemHeight, getItemLayout);
    const sectionLengths = self.getSectionLengths(sections, data);
    const processor = new _BigListProcessor.default({
      sections: sectionLengths,
      itemHeight: layoutItemHeight,
      headerHeight,
      footerHeight,
      sectionHeaderHeight,
      sectionFooterHeight,
      insetTop,
      insetBottom,
      numColumns,
    });
    return {
      ...{
        batchSize,
        blockStart,
        blockEnd,
      },
      ...processor.process(
        blockStart - batchSize,
        blockEnd + batchSize,
        prevItems || []
      ),
    };
  }
  /**
   * Get list state
   * @param {object} props
   * @param {object} options.
   * @return {{blockStart: *, batchSize: *, blockEnd: *, items: *[], height: *}|{blockStart, batchSize, blockEnd, items: *[], height: *}}
   */
  getListState(props, options) {
    const stateProps = props || this.props;
    return this.constructor.getListState(
      stateProps,
      options ||
        (0, _utils.processBlock)({
          containerHeight: this.containerHeight,
          scrollTop: this.scrollTop,
          batchSizeThreshold: stateProps.batchSizeThreshold,
        })
    );
  }
  /**
   * Get sections item lengths.
   * @param {array[]|object<string, object>|null|undefined} sections
   * @param {array} data
   * @returns {int[]}
   */
  static getSectionLengths(sections = null, data = null) {
    if (sections !== null) {
      return sections.map((section) => {
        return section.length;
      });
    }

    return [data === null || data === void 0 ? void 0 : data.length];
  }
  /**
   * Get sections item lengths.
   * @returns {int[]}
   */
  getSectionLengths() {
    const { sections, data } = this.props;
    return this.constructor.getSectionLengths(sections, data);
  }
  /**
   * Get item height.
   * @param {number} itemHeight
   * @param {function|null|undefined} getItemLayout
   * @return {null|*}
   */
  static getItemHeight(itemHeight, getItemLayout) {
    if (getItemLayout) {
      const itemLayout = getItemLayout([], 0);
      return itemLayout.length;
    }

    if (itemHeight) {
      return itemHeight;
    }

    return null;
  }
  /**
   * Get item height.
   * @return {null|*}
   */
  getItemHeight() {
    const { itemHeight, getItemLayout } = this.props;
    return this.constructor.getItemHeight(itemHeight, getItemLayout);
  }
  /**
   * Is item visible.
   * @param {int} index
   * @param {int} section
   * @returns {boolean}
   */
  isVisible({ index, section = 0 }) {
    const position = this.getItemOffset({
      index,
      section,
    });
    return (
      position >= this.scrollTop &&
      position <= this.scrollTop + this.containerHeight
    );
  }
  /**
   * Provides a reference to the underlying scroll component.
   * @returns {ScrollView|null}
   */
  getNativeScrollRef() {
    return this.scrollView.current;
  }
  /**
   * Get list processor,
   * @returns {BigListProcessor}
   */
  getListProcessor() {
    const scrollView = this.getNativeScrollRef();

    if (scrollView != null) {
      const {
        headerHeight,
        footerHeight,
        sectionHeaderHeight,
        sectionFooterHeight,
        insetTop,
        insetBottom,
        numColumns,
      } = this.props;
      const itemHeight = this.getItemHeight();
      const sectionLengths = this.getSectionLengths();
      return new _BigListProcessor.default({
        sections: sectionLengths,
        headerHeight,
        footerHeight,
        sectionHeaderHeight,
        sectionFooterHeight,
        itemHeight,
        insetTop,
        insetBottom,
        scrollView,
        numColumns,
      });
    }

    return null;
  }
  /**
   * Displays the scroll indicators momentarily.
   */
  flashScrollIndicators() {
    const scrollView = this.getNativeScrollRef();

    if (scrollView != null) {
      scrollView.flashScrollIndicators();
    }
  }
  /**
   * Scrolls to a given x, y offset, either immediately, with a smooth animation.
   * @param {int} x
   * @param {int} y
   * @param {bool} animated
   */
  scrollTo({ x = 0, y = 0, animated = true } = {}) {
    const scrollView = this.getNativeScrollRef();

    if (scrollView != null) {
      scrollView.scrollTo({
        x: x,
        y: y,
        animated,
      });
    }
  }
  /**
   * Scroll to index.
   * @param {int} index
   * @param {int} section
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToIndex({ index, section = 0, animated = true }) {
    const processor = this.getListProcessor();

    if (processor != null && index != null && section != null) {
      return processor.scrollToPosition(section, index, animated);
    }

    return false;
  }
  /**
   * Alias to scrollToIndex with polyfill for SectionList.
   * @see scrollToIndex
   * @param {int} itemIndex
   * @param {int} sectionIndex
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToLocation({ itemIndex, sectionIndex, animated = true }) {
    return this.scrollToIndex({
      section: sectionIndex,
      index: itemIndex,
      animated,
    });
  }
  /**
   * Scroll to item.
   * @param {object} item
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToItem({ item, animated = false }) {
    let index;

    if (this.hasSections()) {
      const coords = JSON.stringify(
        this.map((a) => {
          return a[0] + "|" + a[1];
        })
      );
      index = coords.indexOf(item[0] + "|" + item[1]) !== -1;
    } else {
      index = this.props.data.indexOf(item);
    }

    return this.scrollToIndex({
      index,
      animated,
    });
  }
  /**
   * Scroll to offset.
   * @param {number} offset
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToOffset({ offset, animated = false }) {
    const scrollRef = this.getNativeScrollRef();

    if (scrollRef != null) {
      scrollRef.scrollTo({
        x: 0,
        y: offset,
        animated,
      });
      return true;
    }

    return false;
  }
  /**
   * Scroll to top.
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToTop({ animated = true } = {}) {
    return this.scrollTo({
      x: 0,
      y: 0,
      animated,
    });
  }
  /**
   * Scroll to end.
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToEnd({ animated = true } = {}) {
    const { data } = this.props;
    let section = 0;
    let index = 0;

    if (this.hasSections()) {
      const sectionLengths = this.getSectionLengths();
      section = sectionLengths[sectionLengths.length - 1];
    } else {
      index = data.length;
    }

    return this.scrollToIndex({
      section,
      index,
      animated,
    });
  }
  /**
   * Scroll to section.
   * @param {int} section
   * @param {bool} animated
   * @returns {bool}
   */
  scrollToSection({ section, animated = true }) {
    return this.scrollToIndex({
      index: 0,
      section,
      animated,
    });
  }
  /**
   * On viewable items changed.
   */
  onViewableItemsChanged() {
    const { onViewableItemsChanged } = this.props;

    if (onViewableItemsChanged) {
      const prevItems = this.viewableItems;
      const currentItems = this.state.items
        .map(({ type, section, index, key }) => {
          if (type === _BigListItem.BigListItemType.ITEM) {
            return {
              item: this.getItem({
                section,
                index,
              }),
              key: key,
              index: (section + 1) * index,
              isViewable: this.isVisible({
                section,
                index,
              }),
            };
          }

          return false;
        })
        .filter(Boolean);
      this.viewableItems = currentItems.filter((item) => item.isViewable);
      const changed = prevItems
        .filter(
          ({ index: prevIndex }) =>
            !this.viewableItems.some(
              ({ index: nextIndex }) => nextIndex === prevIndex
            )
        )
        .map((item) => {
          item.isViewable = this.isVisible({
            section: item.section,
            index: item.index,
          });
          return item;
        });
      const prevViewableItem = prevItems.length;
      const currentViewableItem = this.viewableItems.length;

      if (changed.length > 0 || prevViewableItem !== currentViewableItem) {
        onViewableItemsChanged({
          viewableItems: this.viewableItems,
          changed,
        });
      }
    }
  }
  /**
   * Handle scroll.
   * @param event
   */
  onScroll(event) {
    const { nativeEvent } = event;
    const { contentInset, batchSizeThreshold, onViewableItemsChanged } =
      this.props;
    this.containerHeight =
      nativeEvent.layoutMeasurement.height -
      (contentInset.top || 0) -
      (contentInset.bottom || 0);
    this.scrollTop = Math.min(
      Math.max(0, nativeEvent.contentOffset.y),
      nativeEvent.contentSize.height - this.containerHeight
    );
    const nextState = (0, _utils.processBlock)({
      containerHeight: this.containerHeight,
      scrollTop: this.scrollTop,
      batchSizeThreshold,
    });

    if (
      nextState.batchSize !== this.state.batchSize ||
      nextState.blockStart !== this.state.blockStart ||
      nextState.blockEnd !== this.state.blockEnd
    ) {
      this.setState(nextState);
    }

    if (onViewableItemsChanged) {
      this.onViewableItemsChanged();
    }

    const { onScroll, onEndReached, onEndReachedThreshold } = this.props;

    if (onScroll != null) {
      onScroll(event);
    }

    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const distanceFromEnd =
      contentSize.height - (layoutMeasurement.height + contentOffset.y);

    if (distanceFromEnd <= layoutMeasurement.height * onEndReachedThreshold) {
      if (!this.endReached) {
        this.endReached = true;
        onEndReached &&
          onEndReached({
            distanceFromEnd,
          });
      }
    } else {
      this.endReached = false;
    }
  }
  /**
   * Handle layout.
   * @param event
   */
  onLayout(event) {
    const { nativeEvent } = event;
    const { contentInset, batchSizeThreshold } = this.props;
    this.containerHeight =
      nativeEvent.layout.height -
      (contentInset.top || 0) -
      (contentInset.bottom || 0);
    const nextState = (0, _utils.processBlock)({
      containerHeight: this.containerHeight,
      scrollTop: this.scrollTop,
      batchSizeThreshold,
    });

    if (
      nextState.batchSize !== this.state.batchSize ||
      nextState.blockStart !== this.state.blockStart ||
      nextState.blockEnd !== this.state.blockEnd
    ) {
      this.setState(nextState);
    }

    const { onLayout } = this.props;

    if (onLayout) {
      onLayout(event);
    }
  }
  /**
   * Handle scroll end.
   * @param event
   */
  onScrollEnd(event) {
    const { renderAccessory, onScrollEnd } = this.props;

    if (renderAccessory != null) {
      this.forceUpdate();
    }

    if (onScrollEnd) {
      onScrollEnd(event);
    }
  }
  /**
   * Handle scroll end.
   * @param event
   */
  onMomentumScrollEnd(event) {
    const { onMomentumScrollEnd } = this.props;
    this.onScrollEnd(event);

    if (onMomentumScrollEnd) {
      onMomentumScrollEnd(event);
    }
  }
  /**
   * Is empty
   * @returns {boolean}
   */
  isEmpty() {
    const sectionLengths = this.getSectionLengths();
    const length = sectionLengths.reduce((total, sectionLength) => {
      return total + sectionLength;
    }, 0);
    return length === 0;
  }
  /**
   * Get derived state.
   * @param props
   * @param state
   * @returns {{blockStart: *, batchSize: *, blockEnd: *, items: *[], height: *}|{blockStart, batchSize, blockEnd, items: *[], height: *}}
   */
  static getDerivedStateFromProps(props, state) {
    return BigList.getListState(props, state);
  }
  /**
   * Has sections.
   * @returns {boolean}
   */
  hasSections() {
    return this.props.sections !== null;
  }
  /**
   * Get item scroll view offset.
   * @param {int} section
   * @param {int} index
   * @returns {*}
   */
  getItemOffset({ section = 0, index }) {
    const {
      insetTop,
      headerHeight,
      sectionHeaderHeight,
      sectionFooterHeight,
      numColumns,
      itemHeight,
    } = this.props; // Header + inset

    let offset =
      insetTop + (0, _utils.isNumeric)(headerHeight)
        ? Number(headerHeight)
        : headerHeight();
    const sections = this.getSectionLengths();
    let foundIndex = false;
    let s = 0;

    while (s <= section) {
      const rows = Math.ceil(sections[section] / numColumns);

      if (rows === 0) {
        s += 1;
        continue;
      } // Section header

      offset += (0, _utils.isNumeric)(sectionHeaderHeight)
        ? Number(sectionHeaderHeight)
        : sectionHeaderHeight(s); // Items

      if ((0, _utils.isNumeric)(itemHeight)) {
        const uniformHeight = this.getItemHeight(section);

        if (s === section) {
          offset += uniformHeight * Math.ceil(index / numColumns);
          foundIndex = true;
        } else {
          offset += uniformHeight * rows;
        }
      } else {
        for (let i = 0; i < rows; i++) {
          if (s < section || (s === section && i < index)) {
            offset += itemHeight(s, Math.ceil(i / numColumns));
          } else if (s === section && i === index) {
            foundIndex = true;
            break;
          }
        }
      } // Section footer

      if (!foundIndex) {
        offset += (0, _utils.isNumeric)(sectionFooterHeight)
          ? Number(sectionFooterHeight)
          : sectionFooterHeight(s);
      }

      s += 1;
    }

    return offset;
  }
  /**
   * Get item data.
   * @param {int} section
   * @param {int} index
   * @returns {*}
   */
  getItem({ index, section = 0 }) {
    if (this.hasSections()) {
      return this.props.sections[section][index];
    } else {
      return this.props.data[index];
    }
  }
  /**
   * Get items data.
   * @returns {*}
   */
  getItems() {
    return this.hasSections() ? this.props.sections : this.props.data;
  }
  /**
   * Render all list items.
   * @returns {[]|*}
   */
  renderItems() {
    const {
      keyExtractor,
      numColumns,
      hideMarginalsOnEmpty,
      hideHeaderOnEmpty,
      hideFooterOnEmpty,
      columnWrapperStyle,
      controlItemRender,
      placeholder,
      placeholderComponent,
      placeholderImage,
      ListEmptyComponent,
      ListFooterComponent,
      ListFooterComponentStyle,
      ListHeaderComponent,
      ListHeaderComponentStyle,
      renderHeader,
      renderFooter,
      renderSectionHeader,
      renderItem,
      renderSectionFooter,
      renderEmpty,
    } = this.props;
    const { items = [] } = this.state;
    const itemStyle = this.getBaseStyle();
    const fullItemStyle = (0, _utils.mergeViewStyle)(itemStyle, {
      width: "100%",
    }); // On empty list

    const isEmptyList = this.isEmpty();
    const emptyItem = ListEmptyComponent
      ? (0, _utils.createElement)(ListEmptyComponent)
      : renderEmpty
      ? renderEmpty()
      : null;

    if (isEmptyList && emptyItem) {
      if (hideMarginalsOnEmpty || (hideHeaderOnEmpty && hideFooterOnEmpty)) {
        // Render empty
        return emptyItem;
      } else {
        // Add empty item
        const headerIndex = items.findIndex(
          (item) => item.type === _BigListItem.BigListItemType.HEADER
        );
        items.splice(headerIndex + 1, 0, {
          type: _BigListItem.BigListItemType.EMPTY,
          key: "empty",
        });

        if (hideHeaderOnEmpty) {
          // Hide header
          items.splice(headerIndex, 1);
        }

        if (hideFooterOnEmpty) {
          // Hide footer
          const footerIndex = items.findIndex(
            (item) => item.type === _BigListItem.BigListItemType.FOOTER
          );
          items.splice(footerIndex, 1);
        }
      }
    } // Sections positions

    const sectionPositions = [];
    items.forEach(({ type, position }) => {
      if (type === _BigListItem.BigListItemType.SECTION_HEADER) {
        sectionPositions.push(position);
      }
    }); // Render items

    const children = [];
    items.forEach(({ type, key, position, height, section, index }) => {
      const itemKey = key || position; // Fallback fix

      let uniqueKey = String((section + 1) * index);
      let child;
      let style;

      switch (type) {
        case _BigListItem.BigListItemType.HEADER:
          if (ListHeaderComponent != null) {
            child = (0, _utils.createElement)(ListHeaderComponent);
            style = (0, _utils.mergeViewStyle)(
              fullItemStyle,
              ListHeaderComponentStyle
            );
          } else {
            child = renderHeader();
            style = fullItemStyle;
          }

        // falls through

        case _BigListItem.BigListItemType.FOOTER:
          if (type === _BigListItem.BigListItemType.FOOTER) {
            if (ListFooterComponent != null) {
              child = (0, _utils.createElement)(ListFooterComponent);
              style = (0, _utils.mergeViewStyle)(
                fullItemStyle,
                ListFooterComponentStyle
              );
            } else {
              child = renderFooter();
              style = fullItemStyle;
            }
          }

        // falls through

        case _BigListItem.BigListItemType.SECTION_FOOTER:
          if (type === _BigListItem.BigListItemType.SECTION_FOOTER) {
            height = isEmptyList ? 0 : height; // Hide section footer on empty

            child = renderSectionFooter(section);
            style = fullItemStyle;
          }

        // falls through

        case _BigListItem.BigListItemType.ITEM:
          if (type === _BigListItem.BigListItemType.ITEM) {
            const item = this.getItem({
              section,
              index,
            });
            uniqueKey = keyExtractor
              ? keyExtractor(item, uniqueKey)
              : uniqueKey;
            style =
              numColumns > 1
                ? (0, _utils.mergeViewStyle)(
                    itemStyle,
                    columnWrapperStyle || {}
                  )
                : itemStyle;
            const renderArguments = {
              item,
              index,
              section: undefined,
              key: undefined,
              style: undefined,
            };

            if (this.hasSections()) {
              renderArguments.section = section;
            }

            if (controlItemRender) {
              renderArguments.key = uniqueKey;
              renderArguments.style = (0, _utils.mergeViewStyle)(style, {
                height,
                width: 100 / numColumns + "%",
              });
            }

            child = renderItem(renderArguments);
          }

          if (child != null) {
            children.push(
              type === _BigListItem.BigListItemType.ITEM && controlItemRender
                ? child
                : /*#__PURE__*/ _react.default.createElement(
                    _BigListItem.default,
                    {
                      key: itemKey,
                      uniqueKey: uniqueKey,
                      height: height,
                      width: 100 / numColumns + "%",
                      style: style,
                    },
                    child
                  )
            );
          }

          break;

        case _BigListItem.BigListItemType.EMPTY:
          children.push(
            /*#__PURE__*/ _react.default.createElement(
              _reactNative.View,
              {
                key: itemKey,
              },
              emptyItem
            )
          );
          break;

        case _BigListItem.BigListItemType.SPACER:
          children.push(
            placeholder
              ? /*#__PURE__*/ _react.default.createElement(
                  _BigListPlaceholder.default,
                  {
                    key: itemKey,
                    height: height,
                    image: placeholderImage,
                    component: placeholderComponent,
                  }
                )
              : /*#__PURE__*/ _react.default.createElement(
                  _BigListItem.default,
                  {
                    key: itemKey,
                    height: height,
                  }
                )
          );
          break;

        case _BigListItem.BigListItemType.SECTION_HEADER:
          height = isEmptyList ? 0 : height; // Hide section header on empty

          sectionPositions.shift();
          child = renderSectionHeader(section);

          if (child != null) {
            children.push(
              /*#__PURE__*/ _react.default.createElement(
                _BigListSection.default,
                {
                  key: itemKey,
                  style: fullItemStyle,
                  height: height,
                  position: position,
                  nextSectionPosition: sectionPositions[0],
                  scrollTopValue: this.scrollTopValue,
                },
                child
              )
            );
          }

          break;
      }
    });
    return children;
  }
  /**
   * Component did mount.
   */
  componentDidMount() {
    const { stickySectionHeadersEnabled } = this.props;
    const scrollView = this.getNativeScrollRef();

    if (
      stickySectionHeadersEnabled &&
      scrollView != null &&
      _reactNative.Platform.OS !== "web"
    ) {
      // Disabled on web
      this.scrollTopValueAttachment = _reactNative.Animated.attachNativeEvent(
        scrollView,
        "onScroll",
        [
          {
            nativeEvent: {
              contentOffset: {
                y: this.scrollTopValue,
              },
            },
          },
        ]
      );
    }
  }
  /**
   * Component did update.
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.initialScrollIndex !== this.props.initialScrollIndex) {
      throw new Error("scrollTopValue cannot changed after mounting");
    }
  }
  /**
   * Component will unmount.
   */
  componentWillUnmount() {
    if (this.scrollTopValueAttachment != null) {
      this.scrollTopValueAttachment.detach();
    }
  }
  /**
   * Get base style.
   * @return {{transform: [{scaleX: number}]}|{transform: [{scaleY: number}]}}
   */
  getBaseStyle() {
    const { inverted, horizontal } = this.props;

    if (inverted) {
      if (horizontal) {
        return {
          transform: [
            {
              scaleX: -1,
            },
          ],
        };
      } else {
        return {
          transform: [
            {
              scaleY: -1,
            },
          ],
        };
      }
    }

    return {};
  }
  /**
   * Render.
   * @returns {JSX.Element}
   */
  render() {
    // Reduce list properties
    const {
      data,
      keyExtractor,
      inverted,
      horizontal,
      // Disabled
      placeholder,
      placeholderImage,
      placeholderComponent,
      sections,
      initialScrollIndex,
      columnWrapperStyle,
      renderHeader,
      renderFooter,
      renderSectionHeader,
      renderItem,
      renderSectionFooter,
      renderScrollViewWrapper,
      renderEmpty,
      renderAccessory,
      itemHeight,
      footerHeight,
      headerHeight,
      sectionHeaderHeight,
      sectionFooterHeight,
      insetTop,
      insetBottom,
      actionSheetScrollRef,
      stickySectionHeadersEnabled,
      onEndReached,
      onEndReachedThreshold,
      onRefresh,
      refreshing,
      ListEmptyComponent,
      ListFooterComponent,
      ListFooterComponentStyle,
      ListHeaderComponent,
      ListHeaderComponentStyle,
      hideMarginalsOnEmpty,
      hideFooterOnEmpty,
      hideHeaderOnEmpty,
      ...props
    } = this.props;

    const wrapper = renderScrollViewWrapper || ((val) => val);

    const handleScroll =
      stickySectionHeadersEnabled && _reactNative.Platform.OS === "web"
        ? _reactNative.Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.scrollTopValue,
                  },
                },
              },
            ],
            {
              listener: (event) => this.onScroll(event),
              useNativeDriver: false,
            }
          )
        : this.onScroll;
    const defaultProps = {
      refreshControl:
        onRefresh && !this.props.refreshControl
          ? /*#__PURE__*/ _react.default.createElement(
              _reactNative.RefreshControl,
              {
                refreshing: refreshing,
                onRefresh: onRefresh,
              }
            )
          : null,
      contentContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        maxWidth: "100%",
      },
    };
    const overwriteProps = {
      ref: (ref) => {
        this.scrollView.current = ref;

        if (actionSheetScrollRef) {
          actionSheetScrollRef.current = ref;
        }
      },
      onScroll: handleScroll,
      onLayout: this.onLayout,
      onMomentumScrollEnd: this.onMomentumScrollEnd,
      onScrollEndDrag: this.onScrollEnd,
    };
    const scrollViewProps = { ...defaultProps, ...props, ...overwriteProps }; // Content container style merge

    scrollViewProps.contentContainerStyle = (0, _utils.mergeViewStyle)(
      props.contentContainerStyle,
      defaultProps.contentContainerStyle
    );
    const scrollView = wrapper(
      /*#__PURE__*/ _react.default.createElement(
        _reactNative.ScrollView,
        scrollViewProps,
        this.renderItems()
      )
    );
    const scrollStyle = (0, _utils.mergeViewStyle)(
      {
        flex: 1,
        maxHeight: _reactNative.Platform.select({
          web: "100vh",
          default: "100%",
        }),
      },
      this.getBaseStyle()
    );
    return /*#__PURE__*/ _react.default.createElement(
      _reactNative.View,
      {
        style: scrollStyle,
      },
      scrollView,
      renderAccessory != null ? renderAccessory(this) : null
    );
  }
}

BigList.propTypes = {
  inverted: _propTypes.default.bool,
  horizontal: _propTypes.default.bool,
  actionSheetScrollRef: _propTypes.default.any,
  batchSizeThreshold: _propTypes.default.number,
  bottom: _propTypes.default.number,
  numColumns: _propTypes.default.number,
  columnWrapperStyle: _propTypes.default.oneOfType([
    _propTypes.default.object,
    _propTypes.default.array,
  ]),
  contentInset: _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number,
  }),
  controlItemRender: _propTypes.default.bool,
  data: _propTypes.default.array,
  placeholder: _propTypes.default.bool,
  placeholderImage: _propTypes.default.any,
  placeholderComponent: _propTypes.default.oneOfType([
    _propTypes.default.elementType,
    _propTypes.default.element,
    _propTypes.default.node,
  ]),
  footerHeight: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
    _propTypes.default.func,
  ]),
  getItemLayout: _propTypes.default.func,
  headerHeight: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
    _propTypes.default.func,
  ]),
  insetBottom: _propTypes.default.number,
  insetTop: _propTypes.default.number,
  itemHeight: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
    _propTypes.default.func,
  ]),
  keyboardDismissMode: _propTypes.default.string,
  keyboardShouldPersistTaps: _propTypes.default.string,
  ListEmptyComponent: _propTypes.default.oneOfType([
    _propTypes.default.elementType,
    _propTypes.default.element,
    _propTypes.default.node,
  ]),
  ListFooterComponent: _propTypes.default.oneOfType([
    _propTypes.default.elementType,
    _propTypes.default.element,
    _propTypes.default.node,
  ]),
  ListFooterComponentStyle: _propTypes.default.oneOfType([
    _propTypes.default.object,
    _propTypes.default.array,
  ]),
  ListHeaderComponent: _propTypes.default.oneOfType([
    _propTypes.default.elementType,
    _propTypes.default.element,
    _propTypes.default.node,
  ]),
  ListHeaderComponentStyle: _propTypes.default.oneOfType([
    _propTypes.default.object,
    _propTypes.default.array,
  ]),
  onEndReached: _propTypes.default.func,
  onEndReachedThreshold: _propTypes.default.number,
  onLayout: _propTypes.default.func,
  onRefresh: _propTypes.default.func,
  onScroll: _propTypes.default.func,
  onScrollEnd: _propTypes.default.func,
  onViewableItemsChanged: _propTypes.default.func,
  removeClippedSubviews: _propTypes.default.bool,
  renderAccessory: _propTypes.default.func,
  renderScrollViewWrapper: _propTypes.default.func,
  renderEmpty: _propTypes.default.func,
  renderFooter: _propTypes.default.func,
  renderHeader: _propTypes.default.func,
  renderItem: _propTypes.default.func.isRequired,
  renderSectionHeader: _propTypes.default.func,
  renderSectionFooter: _propTypes.default.func,
  keyExtractor: _propTypes.default.func,
  refreshing: _propTypes.default.bool,
  scrollEventThrottle: _propTypes.default.number,
  initialScrollIndex: _propTypes.default.number,
  hideMarginalsOnEmpty: _propTypes.default.bool,
  sectionFooterHeight: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
    _propTypes.default.func,
  ]),
  sectionHeaderHeight: _propTypes.default.oneOfType([
    _propTypes.default.string,
    _propTypes.default.number,
    _propTypes.default.func,
  ]),
  sections: _propTypes.default.array,
  stickySectionHeadersEnabled: _propTypes.default.bool,
};
BigList.defaultProps = {
  // Data
  data: [],
  inverted: false,
  horizontal: false,
  sections: null,
  refreshing: false,
  batchSizeThreshold: 1,
  numColumns: 1,
  placeholder: _reactNative.Platform.select({
    web: false,
    default: false,
    /* TODO: default disabled until a solution for different screen sizes is found */
  }),
  // Renders
  renderItem: () => null,
  renderHeader: () => null,
  renderFooter: () => null,
  renderSectionHeader: () => null,
  renderSectionFooter: () => null,
  hideMarginalsOnEmpty: false,
  hideFooterOnEmpty: false,
  hideHeaderOnEmpty: false,
  controlItemRender: false,
  // Height
  itemHeight: 50,
  headerHeight: 0,
  footerHeight: 0,
  sectionHeaderHeight: 0,
  sectionFooterHeight: 0,
  // Scroll
  stickySectionHeadersEnabled: true,
  removeClippedSubviews: false,
  scrollEventThrottle: _reactNative.Platform.OS === "web" ? 5 : 16,
  // Keyboard
  keyboardShouldPersistTaps: "always",
  keyboardDismissMode: "interactive",
  // Insets
  insetTop: 0,
  insetBottom: 0,
  contentInset: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  onEndReachedThreshold: 0,
};
var _default = BigList;
exports.default = _default;
//# sourceMappingURL=BigList.js.map
