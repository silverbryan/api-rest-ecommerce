const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');

const server = express();

server.name = 'Ecommerce Server';
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '5mb' }));
server.use(morgan('dev'));
server.use(cors());
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
server.use('/api/v1', routes);

module.exports = server;