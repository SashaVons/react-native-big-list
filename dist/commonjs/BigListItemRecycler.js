"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _BigListItem = require("./BigListItem");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class BigListItemRecycler {
  /**
   * Constructor.
   * @param {object[]} items
   */
  constructor(items) {
    this.items = {};
    this.pendingItems = {};
    items.forEach((item) => {
      const { type, section, index } = item;
      const [itemsForType] = this.itemsForType(type);
      itemsForType[`${type}:${section}:${index}`] = item;
    });
  }
  /**
   * Items for type.
   * @param {any} type
   * @returns {(*|{}|*[])[]}
   */
  itemsForType(type) {
    return [
      this.items[type] || (this.items[type] = {}),
      this.pendingItems[type] || (this.pendingItems[type] = []),
    ];
  }
  /**
   * Get item.
   * @param {any} type
   * @param {number} position
   * @param {number} height
   * @param {int} section
   * @param {int} index
   * @returns {{section: int, position: number, index: number, type: any, key: number, height: int}}
   */
  get({ type, position, height, section = 0, index = 0 }) {
    const [items, pendingItems] = this.itemsForType(type);
    const itemKey = `${type}:${section}:${index}`;
    let item = items[itemKey];

    if (item == null) {
      item = {
        type,
        key: -1,
        position,
        height,
        section,
        index,
      };
      pendingItems.push(item);
    } else {
      item.position = position;
      item.height = height;
      delete items[itemKey];
    }

    return item;
  }
  /**
   * Fill.
   */
  fill() {
    Object.values(_BigListItem.BigListItemType).forEach((type) => {
      const [items, pendingItems] = this.itemsForType(type);
      let index = 0;
      Object.values(items).forEach(({ key }) => {
        const item = pendingItems[index];

        if (item == null) {
          return false;
        }

        item.key = key;
        index++;
      });

      for (; index < pendingItems.length; index++) {
        pendingItems[index].key = ++BigListItemRecycler.lastKey;
      }

      pendingItems.length = 0;
    });
  }
}

_defineProperty(BigListItemRecycler, "lastKey", 0);

var _default = BigListItemRecycler;
exports.default = _default;
//# sourceMappingURL=BigListItemRecycler.js.map
