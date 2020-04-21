import crypto from 'crypto';
import CardCollection from './card-collection';

/**
 * Creates a new Player Instance.
 * @class
 * @param {String} username - The name of the user to add.
 * @property {String} username - The username of the user.
 * @property {String} id - A unique identifier to identify the user.
 * @property {CardCollection} hand - The group of cards that a user possesses.
 */
export default class Player {
  constructor(username) {
    this.username = username;
    this.id = this.generateId();
    this.hand = new CardCollection();
  }

  /**
   * This method generates ids for a player.
   * @returns {String}
   */
  generateId() {
    return crypto.randomBytes(10).toString('hex');
  }

  /**
   * This method plays a card for a given user.
   * @returns {Card} - The card to play.
   */
  playCard() {
    return this.hand.removeFromTop();
  }

  /**
   * This method adds a card to the bottom of the player's hand.
   * @param {Card} card - The card to add.
   * @returns undefined
   */
  addCardToBottom(card){
    this.hand.addToBottom(card);
  }

  /**
   * This method adds a card to the top of the player's hand
   * @param {Card} card - The card to add.
   * @returns undefined
   */
  addCardToTop(card){
    this.hand.addToTop(card);
  }

  /**
   * This method returns the hand size of player.
   * @returns {number}
   */
  getHandSize(){
    return this.hand.getSize();
  }

  /**
   * This method returns the user's hand.
   * @returns {CardCollection} - The user's hand.
   */
  getHand(){
    return this.hand;
  }

  /**
   * This method sets the object from a regular js object
   * @param object
   * @returns undefined
   */
  fromObject(object) {
    this.username = object.username;
    this.id = object.id;
    this.pile = object.pile.map(card => {
      const c = new Card();
      c.fromObject(card);
      return c;
    });
  }

  toObject() {
    return {
      username: this.username,
      id: this.id,
      pile: this.pile.map(card => card.toObject())
    };
  }
}
