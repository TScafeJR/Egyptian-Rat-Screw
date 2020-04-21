import LinkedList from './data-structures/linked-list';

/**
 * This class creates a new CardCollection instance.
 * @class
 * @property {LinkedList} pile - The pile of cards.
 */
export default class CardCollection {
  constructor() {
    this.pile = new LinkedList();
  }

  /**
   * This method adds a card to the bottom of the queue.
   * @param {Card} card
   */
  addToBottom(card) {
    this.pile.addToBottom(card);
  }

  /**
   * This method adds a card to the top of the queue.
   * @param {Card} card
   */
  addToTop(card) {
    this.pile.addToTop(card);
  }

  /**
   * This method adds multiple cards to the top of the input deck.
   * @param {Card[]} pile
   */
  addCardsToTop(pile) {
    pile.forEach(card => {
      this.addToTop(card);
    });

  }

  /**
   * This method adds multiple cards to the bottom of the input deck.
   * @param {Card[]} pile
   */
  addCardsToBottom(pile) {
    pile.forEach(card => {
      this.addToTop(card);
    });
  }

  /**
   * This method removes a card from the top of the queue.
   * @returns {Card}
   */
  removeFromTop() {
    return this.pile.remove().element;
  }

  /**
   * This method returns the card at the top of the deck.
   * @returns {Card}
   */
  getTop() {
    return this.pile.getHead().element;
  }

  /**
   * This method lets us know if the card collection is empty.
   * @returns {boolean}
   */
  isEmpty(){
    return this.pile.isEmpty();
  }

  getSize(){
    return this.pile.getSize();
  }
}
