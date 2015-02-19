/**
 * Created by deepak on 19/02/15.
 */
var app         = require('express')();
var socket      = require('socket.io');
var http        = require('http');
var queryProcess= require('./middleware/query');
//var routes  = require('./routes');

var port    = process.env.PORT || 3000;
var server  = app.listen(port);
var io      = socket.listen(server); // this tells socket.io to use our express server

var clients = {};

io.sockets.on('connection', function (socket) {

    console.log('A new user connected!');

    socket.on('user_auth', function(data){

        var queryData = new queryProcess(data.usertoken,data.uid );

        console.log(data.usertoken);
        console.log(data.uid);

        // Store a reference to your socket ID
        clients[data.uid] = {
            "socket": socket.id
        };

        if (clients[data.uid]){
            queryData.getData(function(err, result){
                //console.log(result);
                io.sockets.connected[clients[data.uid].socket].emit("notification", result);
            });

        } else {
            console.log("User does not exist: " + data.uid);
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





