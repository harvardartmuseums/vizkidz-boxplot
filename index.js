'use strict';

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const PORT = process.env.PORT || 3000;

app.get('/boxplot.html', function(req, res){
	res.sendFile(path.join(__dirname, '/projectors.html'));
});

app.get('/input.html', function(req, res){
	res.sendFile(path.join(__dirname, '/screens.html'));
});

server.listen(PORT);


var plotIO = io.of('/plot-namespace');
var inputIO = io.of('/input-namespace');
var data = [];

plotIO.on('connection', function(socket) {
	plotIO.to(socket.id).emit('data', data);
});

inputIO.on('connection', function(socket) {
	socket.on('newData', function(dataPoint) {
		data.push(dataPoint);
		plotIO.emit('newData', dataPoint);
	);
});