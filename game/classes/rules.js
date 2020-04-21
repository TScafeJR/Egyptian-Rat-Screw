/**
 * Creates a new Rules instance
 * @class
 */
export default class Rules {
  constructor() {}

  /**
   * This method returns a value that determines whether a slap is valid or not
   * @param {Deck} pile
   * @returns {boolean}
   */
  goodSlapCondition(pile) {
    const { length } = pile;
    const sameRandomInMiddle = length > 2 && pile[length - 1].value === pile[length - 3].value;
    const sameBackToBack = length > 1 && pile[length - 1].value === pile[length - 2].value;
    const isJack = pile[length - 1].value === 11;

    return sameBackToBack || sameRandomInMiddle || isJack;
  }

  /**
   * This method sacrifices cards for a player and adds them to the bottom of the deck
   * @param {Deck} deck
   * @param {Player} player
   * @param {Number} numOfCards
   * @returns {Number} number of cards extracted from user
   */
  sacrificeCards(deck, player, numOfCards){
    let i = 0;
    for (i; i <= numOfCards; i++){
      if (player.deck.length){
        deck.addToBottom(player.deck.removeFromTop());
      } else {
        break;
      }
    }

    return i;
  }
}
