/**
 * Creates a new Node instance
 * @class
 * @param {*} element - The element value of the node.
 * @property {*} element - The element value of the node.
 * @property {?Node} next - The next element following the node.
 * @property {?Node} prev - The previous node.
 */
export default class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
    this.prev = null;
  }
}
