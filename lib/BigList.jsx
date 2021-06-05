import React, { PureComponent } from "react";
import { Animated, Platform, ScrollView, View } from "react-native";

import BigListItem, { BigListItemType } from "./BigListItem";
import BigListProcessor from "./BigListProcessor";
import BigListSection from "./BigListSection";
import { autobind, processBlock } from "./utils";

class BigList extends PureComponent {
  /**
   * Constructor.
   * @param props
   */
  constructor(props) {
    super(props);
    this.containerHeight = 0;
    this.scrollTop = 0;
    this.scrollTopValue = this.props.scrollTopValue || new Animated.Value(0);
    this.scrollView = React.createRef();
    this.state = BigList.getListState(
      this.props,
      processBlock(this.containerHeight, this.scrollTop),
    );
    autobind(this);
  }

  /**
   * Get list state.
   * @param data
   * @param headerHeight
   * @param footerHeight
   * @param sectionHeight
   * @param itemHeight
   * @param sectionFooterHeight
   * @param sections
   * @param insetTop
   * @param insetBottom
   * @param batchSize
   * @param blockStart
   * @param blockEnd
   * @param prevItems
   * @returns {{blockStart: *, batchSize: *, blockEnd: *, items: [], height: *}|{blockStart, batchSize, blockEnd, items: [], height: *}}
   */
  static getListState(
    {
      data,
      headerHeight,
      footerHeight,
      sectionHeight,
      itemHeight,
      sectionFooterHeight,
      sections,
      insetTop,
      insetBottom,
    },
    { batchSize, blockStart, blockEnd, items: prevItems },
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
    const sectionLengths = BigList.getSectionLengths(sections, data);
    const processor = new BigListProcessor({
      sections: sectionLengths,
      headerHeight,
      footerHeight,
      sectionHeight,
      itemHeight,
      sectionFooterHeight,
      insetTop,
      insetBottom,
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
        prevItems || [],
      ),
    };
  }

  /**
   * Get sections item lengths.
   * @param {array} sections
   * @param {array} data
   * @returns {int[]}
   */
  static getSectionLengths(sections = null, data = null) {
    if (sections !== null) {
      return sections.map((section) => {
        return section.length;
      });
    }
    return [data?.length];
  }

  /**
   * Is item visible.
   * @param {int} indexOrSection
   * @param {int|null} row
   * @returns {boolean}
   */
  isVisible(indexOrSection, row = null) {
    let section = indexOrSection;
    if (!this.hasSections()) {
      row = section;
      section = 1;
    }
    const position =
      this.props.headerHeight +
      section * this.props.sectionHeight +
      row * this.props.itemHeight;
    return (
      position >= this.scrollTop &&
      position <= this.scrollTop + this.containerHeight
    );
  }

  /**
   * Scroll to location.
   * @param section
   * @param row
   * @param animated
   */
  scrollToLocation(section, row, animated = true) {
    const scrollView = this.scrollView.current;
    if (scrollView != null) {
      const {
        data,
        sections,
        headerHeight,
        footerHeight,
        sectionHeight,
        itemHeight,
        sectionFooterHeight,
        insetTop,
        insetBottom,
      } = this.props;
      const sectionLengths = BigList.getSectionLengths(sections, data);
      const processor = new BigListProcessor({
        sections: sectionLengths,
        headerHeight,
        footerHeight,
        sectionHeight,
        sectionFooterHeight,
        itemHeight,
        insetTop,
        insetBottom,
        scrollView,
      });
      processor.scrollToPosition(section, row, animated);
    }
  }

  /**
   * Handle scroll.
   * @param event
   */
  onScroll(event) {
    const { nativeEvent } = event;
    const { contentInset } = this.props;
    this.containerHeight =
      nativeEvent.layoutMeasurement.height -
      (contentInset.top || 0) -
      (contentInset.bottom || 0);
    this.scrollTop = Math.min(
      Math.max(0, nativeEvent.contentOffset.y),
      nativeEvent.contentSize.height - this.containerHeight,
    );
    const nextState = processBlock(this.containerHeight, this.scrollTop);
    if (
      nextState.batchSize !== this.state.batchSize ||
      nextState.blockStart !== this.state.blockStart ||
      nextState.blockEnd !== this.state.blockEnd
    ) {
      this.setState(nextState);
    }
    const { onScroll } = this.props;
    if (onScroll != null) {
      onScroll(event);
    }
  }

  /**
   * Handle layout.
   * @param event
   */
  onLayout(event) {
    const { nativeEvent } = event;
    const { contentInset } = this.props;
    this.containerHeight =
      nativeEvent.layout.height -
      (contentInset.top || 0) -
      (contentInset.bottom || 0);
    const nextState = processBlock(this.containerHeight, this.scrollTop);
    if (
      nextState.batchSize !== this.state.batchSize ||
      nextState.blockStart !== this.state.blockStart ||
      nextState.blockEnd !== this.state.blockEnd
    ) {
      this.setState(nextState);
    }
    const { onLayout } = this.props;
    if (onLayout != null) {
      onLayout(event);
    }
  }

  /**
   * BigList only re-renders when items change which which does not happen with
   * every scroll event. Since an accessory might depend on scroll position this
   * ensures the accessory at least re-renders when scrolling ends
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
   * Is empty
   * @returns {boolean}
   */
  isEmpty() {
    const sectionLengths = BigList.getSectionLengths(
      this.props.sections,
      this.props.data,
    );
    const length = sectionLengths.reduce((total, rowLength) => {
      return total + rowLength;
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
   * Get item data.
   * @param section
   * @param row
   * @returns {*}
   */
  getItem(section, row) {
    if (this.hasSections()) {
      return this.props.sections[section][row];
    } else {
      return this.props.data[row];
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
      renderHeader,
      renderFooter,
      renderSection,
      renderItem,
      renderSectionFooter,
      renderEmpty,
    } = this.props;
    const { items = [] } = this.state;
    if (renderEmpty != null && this.isEmpty()) {
      return renderEmpty();
    }
    const sectionPositions = [];
    items.forEach(({ type, position }) => {
      if (type === BigListItemType.SECTION) {
        sectionPositions.push(position);
      }
    });
    const children = [];
    items.forEach(({ type, key, position, height, section, row }) => {
      let child;
      switch (type) {
        case BigListItemType.HEADER:
          child = renderHeader();
        // falls through
        case BigListItemType.FOOTER:
          if (type === BigListItemType.FOOTER) {
            child = renderFooter();
          }
        // falls through
        case BigListItemType.ROW:
          if (type === BigListItemType.ROW) {
            const item = this.getItem(section, row);
            if (this.hasSections()) {
              child = renderItem({ item, section, row });
            } else {
              child = renderItem({ item, index: row });
            }
          }
        // falls through
        case BigListItemType.SECTION_FOOTER:
          if (type === BigListItemType.SECTION_FOOTER) {
            child = renderSectionFooter(section);
          }
        // falls through
        case BigListItemType.ITEM:
          if (child != null) {
            children.push(
              <BigListItem key={key} height={height}>
                {child}
              </BigListItem>,
            );
          }
          break;
        case BigListItemType.SPACER: {
          children.push(<BigListItem key={key} height={height} />);
          break;
        }
        case BigListItemType.SECTION:
          sectionPositions.shift();
          child = renderSection(section);
          if (child != null) {
            children.push(
              <BigListSection
                key={key}
                height={height}
                position={position}
                nextSectionPosition={sectionPositions[0]}
                scrollTopValue={this.scrollTopValue}
              >
                {child}
              </BigListSection>,
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
    if (this.scrollView.current != null) {
      if (Platform.OS !== "web") {
        // Disabled on web
        this.scrollTopValueAttachment = Animated.attachNativeEvent(
          this.scrollView.current,
          "onScroll",
          [{ nativeEvent: { contentOffset: { y: this.scrollTopValue } } }],
        );
      }
    }
  }

  /**
   * Component did update.
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.scrollTopValue !== this.props.scrollTopValue) {
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
   * Render.
   * @returns {JSX.Element}
   */
  render() {
    // Reduce list properties
    const {
      data,
      sections,
      scrollTopValue,
      renderHeader,
      renderFooter,
      renderSection,
      renderItem,
      renderSectionFooter,
      renderActionSheetScrollViewWrapper,
      renderEmpty,
      renderAccessory,
      itemHeight,
      footerHeight,
      headerHeight,
      sectionHeight,
      sectionFooterHeight,
      insetTop,
      insetBottom,
      actionSheetScrollRef,
      ...props
    } = this.props;

    const wrapper = renderActionSheetScrollViewWrapper || ((val) => val);
    const scrollViewProps = {
      ...props,
      ...{
        ref: (ref) => {
          this.scrollView.current = ref;
          if (actionSheetScrollRef) {
            actionSheetScrollRef.current = ref;
          }
        },
        onScroll: this.onScroll,
        onLayout: this.onLayout,
        onMomentumScrollEnd: this.onScrollEnd,
        onScrollEndDrag: this.onScrollEnd,
      },
    };
    const scrollView = wrapper(
      <ScrollView {...scrollViewProps}>{this.renderItems()}</ScrollView>,
    );
    return (
      <View
        style={{
          flex: 1,
          maxHeight: Platform.select({ web: "100vh", default: "100%" }),
        }}
      >
        {scrollView}
        {renderAccessory != null ? renderAccessory(this) : null}
      </View>
    );
  }
}
BigList.defaultProps = {
  // Data
  data: [],
  sections: null,
  // Renders
  renderItem: () => null,
  renderHeader: () => null,
  renderFooter: () => null,
  renderSection: () => null,
  renderSectionFooter: () => null,
  // Height
  itemHeight: 50,
  headerHeight: 0,
  footerHeight: 0,
  sectionHeight: 0,
  sectionFooterHeight: 0,
  // Scroll
  removeClippedSubviews: false,
  scrollEventThrottle: 16,
  // Keyboard
  keyboardShouldPersistTaps: "always",
  keyboardDismissMode: "interactive",
  // Insets
  insetTop: 0,
  insetBottom: 0,
  contentInset: { top: 0, right: 0, left: 0, bottom: 0 },
};
export default BigList;
