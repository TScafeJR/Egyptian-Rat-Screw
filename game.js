var _ = require('underscore');
var persist = require('./persist');
var Card = require('./card');
var Player = require('./player');

var readGame = false;

class Game {
  constructor() {
    this.isStarted = readGame;
    this.players = {};
    this.playerOrder = [];
    this.pile = [];
  }

  addPlayer(username) {
    if (this.isStarted === true){
      throw 'the game has already started'
    } else if (username.trim() === ''){
      throw 'the username is empty'
    } 

    for(var key in this.players){
      if (this.players[key].username === username){
        throw "This username is not unique";
      }
    }
  
    let player = new Player(username);

    this.playerOrder.push(player.id);

    this.players[player.id] = player;
   
    return player.id;
  }

  startGame() {
    if (this.isStarted){
      throw 'the game has already started';
    } else if (Object.keys(this.players).length < 2){
      throw 'not enough players to play';
    }

    this.isStarted = true;

     for (var i = 1; i < 14; i++){
      var spade = new Card("spades", i)
      this.pile.push(spade)
    }
    for (var i = 1; i < 14; i++){
      var club = new Card("clubs", i)
      this.pile.push(club)
    }
    for (var i = 1; i < 14; i++){
      var diamond = new Card("diamonds", i)
      this.pile.push(diamond)
    }
    for (var i = 1; i < 14; i++){
      var heart = new Card("hearts", i)
      this.pile.push(heart)
    }
    
    this.pile = _.shuffle(this.pile)

    for (var k = 0; k < this.pile.length; k = 0){
      for (var key in this.players){
        if (this.pile.length !== 0){
          this.players[key].pile.push(this.pile.pop());
        }
      }
    }

    console.log('test',
      `players\n`, this.players,
      `\nplayer order\n`, this.playerOrder,
      `\npile\n`, this.pile
    )

  }

  nextPlayer() {
    if (!this.isStarted){
      throw 'the game has yet to start';
    }

    this.playerOrder.push(this.playerOrder.shift())

    if (this.players[this.playerOrder[0]].pile.length === 0){
      nextPlayer()
    }
  }

  isWinning(playerId) {
    if (!this.isStarted){
      throw 'the game has yet to start';
    }
    if (this.players[playerId].pile.length === 52){
    this.isStarted = false;
    return true;
    }
    return false;
  }

  playCard(playerId) {
    if (!this.isStarted){
      throw 'the game has yet to start';
    } else if (playerId !== this.playerOrder[0]){
      throw 'it is not your turn'
    } else if (this.players[this.playerOrder[0]].pile.length === 0){
      throw 'you do not have any cards'
    } 

    this.pile.push(this.players[playerId].pile.pop())

    var count = 0;
    for (var i = 0; i < this.playerOrder.length; i++){
      if (this.players[this.playerOrder[i]].pile.length === 0){
        count++;
      if (count === this.playerOrder.length){
        this.isStarted = false;
        throw 'there are no more cards and there is nothing to slap';
      }
      }
    }

    this.nextPlayer();
    var otherCard = [...this.pile];
    var newCard =otherCard[otherCard.length -1]
    
    return {
      card: newCard,
      cardString: newCard.toString()
    };
    

  }

  slap(playerId) {
    if (!this.isStarted){
      throw "Game has not started";
    }
    //good slap conditions
    if ((this.pile.length > 2 && this.pile[this.pile.length-1].value === this.pile[this.pile.length-3].value) 
    || this.pile[this.pile.length-1].value === 11 
    || this.pile[this.pile.length-1].value === this.pile[this.pile.length - 2].value
  ){
      var copy = this.pile.splice(0);
      this.players[playerId].pile = copy.concat(this.players[playerId].pile);

     var winning = new Object({
        winning: this.isWinning(playerId),
        message: 'got the pile!'
      });
      return winning;
    }
    else {
      var count = 3;
      if (this.players[playerId].pile.length < count){
        count = this.players[playerId].pile.length;
      }
      for (var i = 0; i < count; i++){
        this.pile.unshift(this.players[playerId].pile.pop());
      }
      var losing = new Object({
        winning: false,
        message: 'lost 3 cards!'
      });
      return losing;
    }
  }

  fromObject(object) {
    this.isStarted = object.isStarted;

    this.players = _.mapObject(object.players, player => {
      var p = new Player();
      p.fromObject(player);
      return p;
    });

    this.playerOrder = object.playerOrder;

    this.pile = object.pile.map(card => {
      var c = new Card();
      c.fromObject(card);
      return c;
    });
  }

  toObject() {
    return {
      isStarted: this.isStarted,
      players: _.mapObject(this.players, val => val.toObject()),
      playerOrder: this.playerOrder,
      pile: this.pile.map(card => card.toObject())
    };
  }

  fromJSON(jsonString) {
    this.fromObject(JSON.parse(jsonString));
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  persist() {
    if (readGame && persist.hasExisting()) {
      this.fromJSON(persist.read());
      readGame = true;
    } else {
      persist.write(this.toJSON());
    }
  }
}

module.exports = Game;
