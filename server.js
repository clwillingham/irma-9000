const express = require('express');
const http = require('http');

const app = express();
const io = require('socket.io')(http);

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = new Readline();
port.pipe(parser);


io.on('connection', function (socket) {
    socket.on('new data', function (data) {

        io.sockets.emit('data', data);
    });
});


app.use(express.static('public'));

const serverPort = process.env.PORT || 3000;
http.createServer(app).listen(serverPort, function () {
    console.log('Example app listening on port '+serverPort+'!');
    parser.on('data', function(data){
        console.log(data);
        io.emit('data', data);
    });
});