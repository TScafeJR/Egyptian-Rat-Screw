import _ from 'underscore';
import persist from '../../persist';
import Card from './card';
import Player from './player';
import Deck from './deck';
import PlayerCollection from './player-collection';
import Rules from './rules';
import Dealer from './dealer';

/**
 * Creates a new Game instance.
 * @class
 * @property {boolean} isStarted - A boolean to let you know whether or not the game has started.
 * @property {Deck} deck - The deck that the players will play with.
 * @property {PlayerCollection} players - The collection of players in the game.
 * @property {Rules} rules - The rules of the game.
 * @property {Dealer} dealer - The dealer of the game.
 */
export default class Game {
  constructor() {
    this.isStarted = false;
    this.deck = new Deck().createCards();
    this.players = new PlayerCollection();
    this.rules = new Rules();
    this.dealer = new Dealer();
  }

  /**
   * This method adds a player and returns false if there was an error doing so
   * @param username
   * @returns {String|boolean}
   */
  addPlayer(username){
    let playerInfo;

    try {
      playerInfo = this.players.addPlayer(username, this.isStarted);
    } catch (e) {
      console.error(`There was an error adding the player: ${e}`);
      playerInfo = false;
    }

    return playerInfo;
  }

  /**
   * This method shuffles the cards, deals the cards to all of the players and then starts the game
   */
  startGame(){
    if (this.isStarted) {
      throw 'The game has already started';
    } else if (Object.keys(this.players.playersContainer).length < 2) {
      throw 'There are not enough players to play';
    }

    this.isStarted = true;
    this.deck = this.dealer.shuffleCards(this.deck);
    this.dealer.dealCardsToPlayers(this.deck, this.players);
  }

  /**
   * This method goes to the next player
   * @returns {undefined}
   */
  nextPlayer(){
    if (!this.isStarted) {
      throw 'The game has yet to start';
    }

    this.players.nextPlayer(true);
  }

  /**
   * This method returns the hand of a given player
   * @param {String} playerId
   * @returns {CardCollection}
   */
  getHandInfo(playerId){
    return this.players.getPlayer(playerId).getHand();
  }

  getDeckLength(){
    return this.deck.getSize();
  }

  /**
   * This method returns a full list of players
   * @returns {Map}
   */
  getPlayers(){
    return this.players.getPlayers();
  }

  playerUsernamesToString(){
    const playersInGame = this.getPlayers();
    let str = '';
    playersInGame.forEach(player => {
      str = `${str} ${player},`;
    });

    return str;
  }

  getCurrentPlayerUsername(){
    return this.players.currentPlayer().username;
  }

  /**
   * This method returns the current player.
   * @returns {Player}
   */
  getCurrentPlayer(){
    return this.players.currentPlayer();
  }

  isWinning(playerId){
    if (!this.isStarted) {
      throw 'The game has yet to start';
    }

    return this.players.isWinning(playerId);
  }

  playCard(playerId){
    const currentPlayer = this.players.currentPlayer();
    if (!this.isStarted) {
      throw {
        message: 'The game has yet to start'
      };
    } else if (playerId !== currentPlayer.id) {
      throw {
        message: 'It is not your turn'
      };
    } else if (currentPlayer.pile.length === 0) {
      throw {
        message: 'You do not have any cards'
      };
    }

    this.deck.addToTop(currentPlayer.playCard());

    this.nextPlayer();
    const displayCard = this.deck.getTop();

    return {
      card: displayCard,
      cardString: displayCard.toString()
    };
  }

  slap(playerId){
    if (!this.isStarted) {
      throw 'Game has not started';
    }
    const slappingPlayer = this.players.getPlayer(playerId);
    const SACRIFICE_NUM = 3;

    if (this.rules.goodSlapCondition(this.deck)) {
      const copyDeck = this.deck;
      slappingPlayer.addCardsToBottom(copyDeck);
      this.deck = new Deck();

      return {
        winning: this.isWinning(playerId),
        message: `${slappingPlayer.username} got the pile!`
      };

    } else {
      const numSacrificed = this.rules.sacrificeCards(this.deck, slappingPlayer, SACRIFICE_NUM);

      return {
        winning: false,
        message: `${slappingPlayer.username} lost ${numSacrificed} cards!`
      };
    }
  }

  fromObject(object){
    this.isStarted = object.isStarted;

    this.players = _.mapObject(object.players, player => {
      const p = new Player();
      p.fromObject(player);
      return p;
    });

    this.playerOrder = object.playerOrder;

    this.pile = object.pile.map(card => {
      const c = new Card();
      c.fromObject(card);
      return c;
    });
  }

  toObject(){
    return {
      isStarted: this.isStarted,
      players: _.mapObject(this.players, val => val.toObject()),
      playerOrder: this.playerOrder,
      pile: this.pile.map(card => card.toObject())
    };
  }

  fromJSON(jsonString){
    this.fromObject(JSON.parse(jsonString));
  }

  toJSON(){
    return JSON.stringify(this.toObject());
  }

  persist(){
    if (readGame && persist.hasExisting()) {
      this.fromJSON(persist.read());
      // readGame = true;
    } else {
      persist.write(this.toJSON());
    }
  }
}
