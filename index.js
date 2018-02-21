const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));

// app.get('/', function(req, res){
//    res.sendFile(__dirname + '/index.html');
// });

app.get('/screens/home.html', function(req, res){
   res.sendFile(__dirname + '/screens/home.html');
});

app.get('/screens/player.html', function(req, res){
   res.sendFile(__dirname + '/screens/player.html');
});

app.get('/screens/proctor.html', function(req, res){
   res.sendFile(__dirname + '/screens/proctor.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var createGameID = function() {
    var text = "";
    var possible = "0123456789";
    for(var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    var gameExists = games.filter(function(game,i) {
        return game.id == [text];
    });

    if (gameExists.length) return createGameID();
    return text;
}

// games will exist on server
var games = [];

var Game = function(id, socketID) {
    this.id = id;
    this.players = [];
    this.open = false;
    this.proctor = socketID;
    this.addPlayer = function(player) {
        this.players.push(player.name.toLowerCase().trim())
    }
}

var createGame = function(id, socketID) {
    var g = new Game(id, socketID);

    games.push({'id':id,'game':g});
}

var getGame = function(id) {
    var g = games.filter(function(game,i) {
        return game.id == id;
    });

    return g.length > 0 ? g[0].game : null;
}


var joinGame = function(data) {
    var gameID = data.gameID;
    var name = data.name;

    var g = getGame(gameID);

    // game does not exist error
    if (!g) {
        return {err: 'Game ' + gameID + ' does not exist'};
    }

    // name taken error
    console.log('name taken? ', g.players.includes(name.toLowerCase().trim()))
    console.log(g.players);
    if (g.players.includes(name.toLowerCase().trim())) {
        return {err:'The name ' + name + ' is already taken. Choose another name'};
    }

    var p = new Player(name, gameID);
    g.addPlayer(p);

    // return player object if successful
    console.log(name + ' game joined successfully!')
    return p;
}

var Player = function(name, id) {
    this.name = name;
    this.gameID = id;
}

io.on('connection', function(socket){
  console.log('++++ a user connected');

  // Connection and set up
  socket.on('createGame', function(data) {
    var gameID = createGameID();
    createGame(gameID, socket.id);
    console.log('gameID');
    // pass game id back to creator
    socket.join(gameID);
    socket.emit('gameCreated', gameID)
  });

  socket.on('joinGame', function(data) {
      var d = JSON.parse(data);
      response = joinGame(d);

    if (response.err) {
        socket.emit('joinError',response.err);
        return;
    }

    socket.join(response.gameID);

    socket.emit('gameJoined', JSON.stringify(response));
  });

  socket.on('disconnect', function() {
     console.log('---- a user disconnected')
  });


  // ---------------------------------------
  // Receive from Buzzer
  // ---------------------------------------
  socket.on('buzz',function(data) {
     console.log(data);
     var d = JSON.parse(data);
     var game = getGame(d.gameID);
      // emit response received to proctor
      io.to(game.proctor).emit('buzz', JSON.stringify(d))
  });

  socket.on('countDownOver',function(player) {
      var player = JSON.parse(player);
      var game = getGame(player.gameID);

      io.to(game.proctor).emit('countDownOver', JSON.stringify(player))
  });

  // ---------------------------------------
  // Receive from Proctor
  // ---------------------------------------
  socket.on('gameOpen',function(id) {
      var game = getGame(id);

      // emit to all players that the game is OPEN
      socket.broadcast.to(id).emit('gameOpened', id)
  });

  socket.on('gameClear',function(id) {
      var game = getGame(id);
      game.open = false;

      // emit to all players that the game is CLEARED
      socket.broadcast.to(id).emit('gameCleared')
  })

  socket.on('countDownStart',function(playerID) {
      // start countdown for player
      io.to(playerID).emit('countDownStart', {})
  });
});
