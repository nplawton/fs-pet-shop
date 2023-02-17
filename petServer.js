'use strict';

//console.log('hi world');

const fs = require('fs');
const http = require('http');

const port = 8000;

const server = http.createServer(function(req, res) {
    res.write('Hello Node');
    res.end();
});

server.listen(port, function(error){
    if(error){
        console.log ('Something is wrong: ', error);
    }else{
        console.log('Listening on port:', port);
    }
});