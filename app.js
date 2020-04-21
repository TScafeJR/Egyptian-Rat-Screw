'use strict';

import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Game from './game/classes/game';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => { res.render('index'); });

let game = new Game();
let activeSocketConnections = 0;
let winner = null;

const getGameState = () => {
  let currentPlayerUsername;
  const numCards = {};

  game.getPlayers().forEach(player => {
    numCards[player.username] = player.getHandSize();
  });

  if (!game.isStarted) {
    currentPlayerUsername = 'Game has not started yet.';
  } else {
    currentPlayerUsername = game.getCurrentPlayerUsername();
  }

  return {
    isStarted: game.isStarted,
    numCards: numCards,
    currentPlayerUsername: currentPlayerUsername,
    playersInGame: game.playerUsernamesToString(),
    cardsInDeck: game.getDeckLength(),
    win: winner || undefined
  };
};

io.on('connection', socket => {
  if (game.isStarted) {
    socket.emit('observeOnly');
  }

  activeSocketConnections++;

  socket.on('disconnect', () => {
    activeSocketConnections--;
    if (activeSocketConnections === 0) {
      game = new Game();
      winner = null;
    }
  });

  socket.on('username', data => {
    let player;
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
    } else {
      try {
        player = game.addPlayer(data);
      } catch (e) {
        console.error(JSON.stringify(e, null, 2));
        socket.emit('errorMessage', e.message);
      }

      socket.username = player.username;
      socket.emit('username', player.username);
      io.emit('updateGame', getGameState());
    }
  });

  socket.on('start', () => {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
    } else {
      if (!socket.username) {
        throw {
          message: 'You are not a player of the game.'
        };
      }

      try {
        game.startGame();
      } catch (e) {
        console.log(JSON.stringify(e, null, 2));
        socket.emit('errorMessage', e.message);
      }
      io.emit('start');
      io.emit('updateGame', getGameState());
    }
  });

  socket.on('playCard', () => {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
      return;
    }

    if (!socket.username) {
      throw {
        message: 'You are not a player of the game.'
      };
    } else {
      try {
        const move = game.playCard(socket.playerId);
        io.emit('playCard', move);
      } catch (e) {
        console.log(JSON.stringify(e), 2);
        socket.emit('errorMessage', e.message);
      }
    }


    // broadcast to everyone the game state
    io.emit('updateGame', getGameState());
  });

  socket.on('slap', function() {
    if (winner) {
      socket.emit('errorMessage', `${winner} has won the game. Restart the server to start a new game.`);
      return;
    }
    if (!socket.playerId) {
      socket.emit('errorMessage', 'You are not a player of the game');
    } else {
      try {
        const slapject = game.slap(socket.playerId);
        if (slapject.winning) {
          winner = socket.username;
        }

        if (slapject.message.includes('got the pile!')) {
          io.emit('clearDeck');
        }

        if (!game.players[socket.playerId].pile.length) {
          const active = game.numActivePlayers();
          if (active.length === 1) { //If there is only one active player
            winner = active[0]; //Then he won
            game.isStarted = false; //Game is over
          } else {
            game.nextPlayer();
          }
        }

        io.emit('updateGame', getGameState());
        socket.emit('message', slapject.message);
        socket.broadcast.emit('message', game.players[socket.username].username + ' ' + slapject.message);
      } catch (e) {
        console.log(JSON.stringify(e), 1);
        socket.emit('errorMessage', e.message);
      }
    }
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log(`Express started. Listening on ${process.env.PORT || 3000}`);
});
