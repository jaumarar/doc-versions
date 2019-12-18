const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["Authorization"],
  exposeHeaders: ["Authorization"]
});

const server = restify.createServer({
  name: 'Test App',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

require('routes')(server);

module.exports = server;
