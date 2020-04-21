/**
 * Creates a new Card instance
 * @class
 * @param {string} suit - The suit of the card
 * @property {string} suit - The suit of the card
 * @param {number} value - The numbered value of a card
 * @property {number} value - The numbered value of a card
 */
export default class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  /**
   * This method returns the card in a human readable string version.
   * @returns {string} - A human readable version of the card name.
   */
  toString() {
    let numString;

    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

    switch(this.value){
      case 1:
        numString = 'Ace';
        break;
      case 11:
        numString = 'Jack';
        break;
      case 12:
        numString = 'Queen';
        break;
      case 13:
        numString = 'King';
        break;
      default:
        numString = `${this.value}`;
    }

    const capitalSuit = capitalizeFirstLetter(this.suit);
    return `${numString} of ${capitalSuit}`;
  }

  /**
   * This method converts the object to its elements
   * @param {Object<{value: Number, suit: string}>} object
   */
  fromObject(object) {
    this.value = object.value;
    this.suit = object.suit;
  }

  /**
   * This method returns the Card as an object
   * @returns {{suit: string, value: Number}}
   */
  toObject() {
    return this;
  }
}
