const express = require('express');
const http = require('http');

const app = express();


const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = new Readline();
port.pipe(parser);





app.use(express.static('public'));

const io = require('socket.io')(http);
io.on('connection', function (socket) {
    socket.on('new data', function (data) {

        io.sockets.emit('data', data);
    });
});

const serverPort = process.env.PORT || 3000;
http.createServer(app).listen(serverPort, function () {
    console.log('Example app listening on port '+serverPort+'!');
    parser.on('data', function(data){
        console.log(data);
        io.emit('data', data);
    });
});