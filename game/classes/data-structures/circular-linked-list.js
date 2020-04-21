import Node from './node';
import LinkedList from './linked-list';

/**
 * Creates a new CircularLinkedList instance
 * @class
 * @extends LinkedList
 * @property {?Node} head - This is the head of the linked list.
 * @property {?Node} tail - This is the tail of the linked list.
 * @property {number} size - This is the length of the linked list.
 */
export default class CircularLinkedList extends LinkedList {
  constructor() {
    super();
  }

  /**
   * This method adds an element to the end of the circular linked list
   * @param element
   * @returns {number}
   */
  add(element) {
    const node = new Node(element);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
      return this.size++;
    }

    const tail = this.getTail();
    const head = this.getHead();


    if (this.getSize() === 1) {
      head.next = node;
    }

    node.prev = tail;
    node.next = head;

    this.head.prev = node;
    this.tail = node;

    return this.size++;
  }

  shiftHead() {
    this.tail = this.head;
    this.head = this.head.next;
  }
}
