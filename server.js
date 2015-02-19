/**
 * Created by deepak on 19/02/15.
 */
var app     = require('express')();
var socket  = require('socket.io');
var http    = require('http');
//var routes  = require('./routes');

var port    = process.env.PORT || 3000;


var server = app.listen(port);

var io = socket.listen(server); // this tells socket.io to use our express server

var clients={};

io.sockets.on('connection', function (socket) {

    console.log('A new user connected!');

    socket.on('user_auth', function(data){

        console.log(data.currenttoken);
        console.log(data.currentuser);
        // Store a reference to your socket ID
        clients[data.currentuser] = {
            "socket": socket.id
        };

        console.log("Sending: " + data.currenttoken + " to " + data.currentuser);

        if (clients[data.currentuser]){
            io.sockets.connected[clients[data.currentuser].socket].emit("notification", { msg: 'Hi!'+data.currentuser+' The world is round, there is no up or down.' });
        } else {
            console.log("User does not exist: " + data.currentuser);
        }
    });

    //Removing the socket on disconnect
    socket.on('disconnect', function() {
        for(var name in clients) {
            if(clients[name].socket === socket.id) {
                delete clients[name];
                break;
            }
        }
    })

});





