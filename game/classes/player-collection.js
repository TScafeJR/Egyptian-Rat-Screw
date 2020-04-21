import Player from './player';
import CircularLinkedList from './data-structures/circular-linked-list';

/**
 * This method creates a new instance of the player collection which manages both the player order and the players
 * in the game.
 * @class
 * @property {Map} players - A collection of players in the game.
 * @property {CircularLinkedList} playerOrder - The order of the players.
 * @property {String} firstPlayer - The player at the top of the order.
 */
export default class PlayerCollection {
  constructor() {
    this.players = new Map();
    this.playerOrder = new CircularLinkedList();
    this.firstPlayer = '';
  }

  /**
   * This method adds a player to the player collection.
   * @param {String} username - This is the username of the player to add to the player collection.
   * @param {boolean} gameStarted - A boolean that signifies whether or not the game has started.
   * @returns {Player} player - This is the player added to the player collection.
   */
  addPlayer(username, gameStarted) {
    if (gameStarted) {
      throw 'The game has already started';
    } else if (username.trim() === '') {
      throw 'The username is empty';
    }

    if (this.players.has(username)) {
      throw 'This username is not unique';
    }

    const player = new Player(username);
    this.playerOrder.add(username);
    this.players.set(username, player);

    return player;
  }

  shiftOrder(){
    return this.playerOrder.shiftHead().element;
  }

  /**
   * This method cycles through the players until someone is able to play
   */
  nextPlayer(firstCall) {
    if (firstCall){
       this.firstPlayer = this.currentPlayer().username;
    }

    this.playerOrder.shiftHead();

    if (this.firstPlayer === this.currentPlayer().username){
      throw 'We are back to the first player. This shouldn\'t happen';
    }

    if (this.currentPlayer().hand.getSize() === 0) {
      this.nextPlayer();
    }
  }

  /**
   * This method determines whether or not the current player is winning
   * @param {string} playerId
   * @returns {boolean}
   */
  isWinning(playerId) {
    return this.getPlayer(playerId).hand.length === 52;
  }

  /**
   * This method returns the current player
   * @returns {Player}
   */
  currentPlayer(){
    return this.playerOrder.getHead().element;
  }

  /**
   * This method returns the player corresponding to a given playerId
   * @param {string} playerId
   * @returns {Player}
   */
  getPlayer(playerId){
    return this.players[playerId];
  }

  /**
   * This
   * @returns {Map} - The players in the game.
   */
  getPlayers(){
    return this.players;
  }
}
