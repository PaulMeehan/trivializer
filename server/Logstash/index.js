const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk');

winston.add(new Loggly({
    token: "5351e9d9-7c1c-412f-bf1f-3ccb46b63e79",
    subdomain: "davidpaquette",
    tags: ["Winston-NodeJS"],
    json: true
}));

winston.log('info', "Hello World from Node.js!")