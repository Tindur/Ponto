var express = require("express"),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 8000,
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {log: false}),
    globalVars = { //Note that operations with hard coded users / messages obviously won't work. It's just for show. 
      rooms : [
        {
            id: 1,
            name: 'Hangovers', 
            admin: 'twoTimes',
            users: [
                {
                    name: 'bjerkins', 
                    joined: '2013-03-17T15:11:51.823Z'
                }, 
                {
                    name: 'nosugar', 
                    joined: '2013-03-17T15:11:51.823Z'
                },
                { 
                    name: 'twoTimes', 
                    joined: '2013-03-17T15:11:51.823Z'
                }
            ], 
            topic: 'Talk about hangovers in Germany'
        },
        {
            id: 2, 
            name: 'CatFacts', 
            admin: 'bjerkins',
            users: [
                {
                    name: 'bjerkins', 
                    joined: '2013-03-17T15:11:51.823Z'
                },
                { 
                    name: 'nosugar',
                    joined: '2013-03-17T15:11:51.823Z'
                }
            ], 
            topic: 'Talk about cats'
        }
      ],
      messages: [
        {id: 1, roomId: 1, user: 'bjerkins', date: '2013-03-17T15:11:51.823Z', msg: 'Hah, I\'m so hungover after that monkey' },
        {id: 2, roomId: 2, user: 'nosugar', date: '2012-01-17T01:41:10.823Z', msg: 'Did you know that cats are sleepless creatures during the christmas due to excitement for the elves?' }
      ],
      users : {
        /* Object with key: username and value: currentRoom */
        'bjerkins' : 1,
        'nosugar' : 1,
        'twoTimes' : 1
      }
    }, 
    connections = {};

server.listen(port);
console.log('Server is up and running!');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
    app.use(app.router);
});
    
app.get("/", function(req, res) {
    res.sendfile(__dirname + "/public/site.html");
});

app.get("/login", function(req, res) {
    res.sendfile(__dirname + "/public/site.html");
});

app.get('/rooms/:id', function(req, res) {
    var roomId = req.params.id;
    var room = globalVars.rooms.filter(function(item) {
        return item.id===parseInt(roomId);
    });
    if (room.length > 0) {
        var messages = [];
        for (var i = 0; i < globalVars.messages.length; i++) {
            if (globalVars.messages[i].roomId === parseInt(roomId)) {
                messages.push(globalVars.messages[i]);
            }
        }
        room[0].messages = [];
        for (var i = 0; i < messages.length; i++) {
            room[0].messages.push(messages[i]);    
        }
        res.send(room[0]);  
    }
    else {
        res.send(404);
    }
});

app.get('/rooms', function(req, res) {
    res.send(globalVars.rooms);
});


app.post('/login/:username', function(req, res) {
    var username = req.params.username;
    if (typeof(globalVars.users[username] === 'undefined')) {
        globalVars.users[username] = 0;
        var response = [];
        response.push(false);
        res.send({error: false});
    }
    else {
        var response = [];
        response.push(true);
        res.send({error: true});
    }
});

io.sockets.on('connection', function (socket) {
    socket.username = '';
    
    socket.on('set username', function (data) {
        socket.username = data.username;
        connections[socket.username] = socket;
    });

    socket.on('create room', function (data) {
        var date = new Date();
        var theRoom = {};
        theRoom.id = globalVars.rooms.length + 1;
        theRoom.admin = socket.username;
        theRoom.name = data.roomName;  
        theRoom.topic = data.roomTopic;
        theRoom.users = [];
        globalVars.rooms.push(theRoom);
        io.sockets.emit('receive room', theRoom);    
    });

    socket.on('join room', function (data) {
        var date = new Date();
        var theUser = {};
        theUser.name = socket.username;
        theUser.joined = date;
        for (var i = 0; i < globalVars.rooms.length; i++) {
            if(globalVars.rooms[i].id === parseInt(data.roomId)) {
                globalVars.rooms[i].users.push(theUser);
                globalVars.users[theUser.name] = data.roomId;
                break;
            }
        }
        socket.broadcast.emit('receive user', theUser);
    });

    socket.on('post message', function (data) {
        var date = new Date();
        var theMessage = {};
        theMessage.id = globalVars.messages.length + 1;
        theMessage.roomId = parseInt(data.roomId);
        theMessage.user = socket.username;
        theMessage.date = date;
        theMessage.msg = data.msg;
        globalVars.messages.push(theMessage);
        io.sockets.emit('receive message', theMessage);
    });

    socket.on('kick user', function (data) {
        for (var i = 0; i < globalVars.rooms.length; i++) {
            if(globalVars.rooms[i].id === parseInt(data.roomId)) {
                globalVars.rooms[i].users.splice(globalVars.rooms[i].users.indexOf(data.user),1);
                globalVars.users[data.user] = 0; //currentRoom shall be 0 for no room
            }
        }
        var date = new Date();
        var theMessage = {};
        theMessage.id = globalVars.messages.length + 1;
        theMessage.roomId = parseInt(data.roomId);
        theMessage.user = '-';
        theMessage.date = date;
        theMessage.msg = data.user + ' was kicked from room';

        connections[data.user].emit('move user', data.user);

        io.sockets.emit('kick user client', data.user );
        io.sockets.emit('receive message', theMessage);
    });

    socket.on('leave room', function (data) {
        var roomId = globalVars.users[data.user];
        if (parseInt(roomId) !== 0) {
            for (var i = 0; i < globalVars.rooms.length; i++) {
                if(globalVars.rooms[i].id === parseInt(roomId)) {
                    globalVars.rooms[i].users.splice(globalVars.rooms[i].users.indexOf(data.user),1);
                    globalVars.users[data.user] = 0; //currentRoom shall be 0 for no room
                }
            }
            io.sockets.emit('user left', data);
        }
    });


    socket.on('disconnect', function (data) {
        var roomId = globalVars.users[socket.username];
        if (parseInt(roomId) !== 0) {
            for (var i = 0; i < globalVars.rooms.length; i++) {
                if(globalVars.rooms[i].id === parseInt(roomId)) {
                    globalVars.rooms[i].users.splice(globalVars.rooms[i].users.indexOf(socket.username),1);
                }
            }
            io.sockets.emit('user left', {user: socket.username});
        }
        var username = socket.username;
        delete globalVars.users[username];
    });
});



















