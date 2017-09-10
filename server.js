const express = require('express');
const http = require('http');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = new Readline();
port.pipe(parser);





app.use(express.static('public'));

io.on('connection', function (socket) {
    socket.on('new data', function (data) {
        io.sockets.emit('data', data);
    });
});

const serverPort = process.env.PORT || 3000;
server.listen(serverPort, function () {
    console.log('Example app listening on port '+serverPort+'!');
    parser.on('data', function(data){
        console.log(data);
        io.emit('data', data);
        fs.appendFileSync('fancy-log.csv', moment().format()+','+data+'\r\n'); //I know using synchronous in a callback, probably not proper
    });
});