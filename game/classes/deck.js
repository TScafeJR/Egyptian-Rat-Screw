import Card from './card';
import cardCollection from './card-collection';

/**
 * This class creates a new deck instance.
 * @class
 * @property {LinkedList} pile - The pile of cards in the deck.
 */
export default class Deck extends cardCollection {
  constructor() {
    super();
  }

  /**
   * This method creates the cards.
   * @returns {Deck} - The deck with the cards in it.
   */
  createCards() {
    for (let i = 1; i < 14; i++) {
      const spade = new Card('spades', i);
      const club = new Card('clubs', i);
      const diamond = new Card('diamonds', i);
      const heart = new Card('hearts', i);
      this.addCardsToTop([club, spade, diamond, heart]);
    }
    return this;
  }
}
