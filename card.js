class Card {
  constructor(suit, value) {
    // YOUR CODE HERE
    this.suit = suit;
    this.value = value;
    // value: {
    //   min: 1,
    //   max: 13
    // },
    // suit: ['hearts', 'spades', 'clubs', 'diamonds']
  }

  toString() {
    var numString = '';
    var capitalSuit = '';
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    if (this.value < 11 && this.value > 1){
      numString = this.value.toString();
    }
    else if (this.value === 1){
      numString = 'Ace';
    }
    else if (this.value === 11){
      numString = 'Jack';
    }
    else if (this.value === 12){
      numString = 'Queen';
    }
    else{
      numString = 'King';
    }
    capitalSuit = capitalizeFirstLetter(this.suit);
    return numString + " of " + capitalSuit;
  }

  fromObject(object) {
    this.value = object.value;
    this.suit = object.suit;
  }

  toObject() {
    return {
      value: this.value,
      suit: this.suit
    };
  }
}

module.exports = Card;
