const http = require('http');
const express = require('express');
const app = express();

const PATHTOPROXY = '/api';

const httpProxy = require('http-proxy');

const uiProxy = httpProxy.createProxyServer({
    target: 'http://localhost:8081'
});

const serverProxy = httpProxy.createProxyServer({
    target: 'http://localhost:8080',
    toProxy: true
});


app.all(PATHTOPROXY + '/*', function (req, res) {
    req.url = req.url.replace(PATHTOPROXY, '');
    console.log('redirecting to api ' + req.url);
    serverProxy.web(req, res);
});


app.all("/*", function (req, res) {
    console.log('redirecting to UI');
    uiProxy.web(req, res);
});


const server = http.createServer(app);

server.on('upgrade', function (req, socket, head) {
    serverProxy.ws(req, socket, head);
});

server.listen(9000);
console.log('Proxy running on 9000');
