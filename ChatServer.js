var express = require("express"),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 8000,
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    globalVars = {
      rooms : [
        {
            id: 1,
            name: 'Hangovers', 
            users: [
                {
                    name: 'bjerkins', 
                    joined: '2013-03-17T15:11:51.823Z', 
                    admin: false
                }, 
                {
                    name: 'nosugar', 
                    joined: '2013-03-17T15:11:51.823Z',
                    admin: false
                },
                { 
                    name: 'twoTimes', 
                    joined: '2013-03-17T15:11:51.823Z',
                    admin: true
                }
            ], 
            topic: 'Talk about hangovers in Germany'
        },
        {
            id: 2, 
            name: 'CatFacts', 
            users: [
                {
                    name: 'bjerkins', 
                    joined: '2013-03-17T15:11:51.823Z',
                    admin: true
                },
                { 
                    name: 'nosugar',
                    joined: '2013-03-17T15:11:51.823Z',
                    admin: false
                }
            ], 
            topic: 'Talk about cats'
        }
      ],
      messages: [
        {id: 1, roomId: 1, user: 'bjerkins', date: '2013-03-17T15:11:51.823Z', msg: 'Hah, I\'m so hungover after that monkey' },
        {id: 2, roomId: 2, user: 'nosugar', date: '2012-01-17T01:41:10.823Z', msg: 'Did you know that cats are sleepless creatures during the christmas due to excitement for the elves?' }
      ],
      users : [
        'bjerkins',
        'nosugar',
        'twoTimes'
      ]
    };

server.listen(port);

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

/*app.get("/login", function(req, res) {
    res.send('logged in!');
});*/

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
    if (globalVars.users.indexOf(username) === -1) {
        globalVars.users.push(username);
        var response = [];
        response.push(false);
        res.send({error: false});
    }
    else {
    //TODO, name probably taken, inform the user to pick another username
        console.log('user already exists');
        var response = [];
        response.push(true);
        res.send({error: true});
    }
});

everyone.now.login = function (user) {
    console.log('i will login: ' + user);
}

app.post('/sendMsg', function(req, res) {
    res.send({hello: 'world'});
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

nowjs.on("disconnect", function () {
    //TODO, remove user from globalObject!
    console.log('Disconnected: ' + this.now.name);
});

everyone.now.postRoom = function(roomName, roomTopic) {
    var theUser = {};
    var date = new Date();
    theUser.name = this.now.name;
    theUser.joined = date;
    theUser.admin = true;
    var theRoom = {};
    theRoom.id = globalVars.rooms.length + 1;
    theRoom.name = roomName;  
    theRoom.topic = roomTopic;
    theRoom.users = [];
    theRoom.users.push(theUser);
    globalVars.rooms.push(theRoom);
    everyone.now.receiveRoom(theRoom);
};

everyone.now.postMessage = function(messageText, roomId) {
    var date = new Date();
    var theMessage = {};
    theMessage.id = globalVars.messages.length + 1;
    theMessage.roomId = parseInt(roomId);
    theMessage.user = this.now.name;
    theMessage.date = date;
    theMessage.msg = messageText;
    globalVars.messages.push(theMessage);
    everyone.now.receiveMessage(theMessage);
};

everyone.now.joinRoom = function(roomId) {
    var date = new Date();
    var theUser = {};
    theUser.name = this.now.name;
    theUser.joined = date;
    theUser.admin = false;
    for (var i = 0; i < globalVars.rooms.length; i++) {
        if(globalVars.rooms[i].id === parseInt(roomId)) {
            console.log(globalVars.rooms[i].users, 'users in room ', roomId);
            globalVars.rooms[i].users.push(theUser);
        }
    };
    console.log(everyone.now, 'everyone.now');
    everyone.now.receiveUser(theUser);
}



















