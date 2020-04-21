import Node from './node.js';

/**
 * Creates a new LinkedList instance
 * @class
 * @property {?Node} head - This is the head of the linked list.
 * @property {?Node} tail - This is the tail of the linked list.
 * @property {number} size - This is the length of the linked list.
 */
export default class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  /**
   * This method adds an element to a linked list.
   * @param {*} element - The element to add to the linked list.
   */
  add(element) {
    const node = new Node(element);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
       this.tail.next = node;
       this.tail = node;
    }

    this.size++;
  }


  /**
   * This method adds an element to the end of the linked list.
   * @param {*} element - This is the element that will be added to the linked list.
   */
  addToBottom(element) {
    this.add(element);
  }

  /**
   * This method adds an element to the beginning of the linked list.
   * @param {*} element - This is the element that will be added to the linked list.
   */
  addToTop(element){
    if (this.isEmpty()){
      return this.add(element);
    }

    const node = new Node(element);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  /**
   * This method adds an element at a specific index of a linked list
   * @param element
   * @param index
   * @returns {boolean}
   */
  insertAt(element, index) {
    if (index > 0 && index > this.size){
      return false;
    } else {
      const node = new Node(element);
      let curr;
      let prev;

      curr = this.head;

      if (index === 0) {
        node.next = head;
        this.head = node;
      } else {
        curr = this.head;
        let it = 0;

        while (it < index) {
          it++;
          prev = curr;
          curr = curr.next;
        }

        node.next = curr;
        prev.next = node;
      }
      this.size++;
    }
  }

  /**
   * This method removes an element from a given index
   * and returns that element
   * @param index
   * @returns {number|*}
   */
  removeFrom(index) {
    if (index > 0 && index > this.size) {
      return -1;
    } else {
      let curr;
      let prev;
      let it = 0;

      curr = this.head;
      prev = curr;

      if (index === 0) {
        this.head = curr.next;
      } else {
        while (it < index) {
          it++;
          prev = curr;
          curr = curr.next;
        }
        prev.next = curr.next;
      }
      this.size--;

      return curr.element;
    }
  }

  /**
   * This method removes a specific element from the linked list
   * @param element
   * @returns {WebAssembly.TableKind|number}
   */
  removeElement(element) {
    let current = this.head;
    let prev = null;

    while (current !== null) {
      if (current.element === element) {
        if (prev == null) {
          this.head = current.next;
        } else {
          prev.next = current.next;
        }
        this.size--;
        return current.element;
      }
      prev = current;
      current = current.next;
    }
    return -1;
  }

  /**
   * This method returns the index of given element
   * @param element
   * @returns {number}
   */
  indexOf(element) {
    let count = 0;
    let current = this.head;

    // iterae over the list
    while (current != null) {
      if (current.element === element) {
        return count;
      } else {
        count++;
        current = current.next;
      }
    }

    return -1;
  }

  /**
   * This method lets us know whether or not a linked list is empty.
   * @returns {boolean}
   */
  isEmpty() {
    return this.getSize() === 0;
  }

  /**
   * This method returns the tail node.
   * @returns {Node} - The tail node.
   */
  getTail(){
    return this.tail;
  }

  /**
   * This method returns the head node.
   * @returns {Node} - The head node.
   */
  getHead(){
    return this.head;
  }

  /**
   * This method returns the size of the linked list.
   * @returns {number} - The size of the linked list.
   */
  getSize(){
    return this.size;
  }

  /**
   * This method removes a Node from the top of a linked list.
   * @returns {?Node} - The node to return.
   */
  remove(){
    const { head } = this;
    this.head = head.next;
    return head;
  }
}
