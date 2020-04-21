import { shuffle } from 'underscore';
import Deck from './deck';

/**
 * This class creates a new Dealer instance.
 * @class
 */
export default class Dealer {
  constructor() {
  }

  /**
   * This method shuffles the order of the cards.
   * @param deck
   * @returns {Deck}
   */
  shuffleCards(deck) {
    const collection = [];
    let curr = deck.getHead();
    const finalDeck = new Deck();

    while (curr){
      collection.push(curr);
      curr = curr.next;
    }

    shuffle(collection).forEach(card => {
      finalDeck.addToTop(card);
    });

    return finalDeck;
  }

  /**
   * This method deals cards to all of the players.
   * @param {Deck} deck
   * @param {PlayerCollection} players
   */
  dealCardsToPlayers(deck, players){
    let currPlayer = players.currentPlayer();
    while(!deck.isEmpty()){
      const currCard = deck.removeFromTop();
      currPlayer.addCardToTop(currCard);
      currPlayer = players.shiftOrder();
    }
  }
}
