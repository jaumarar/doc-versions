const restify = require('restify');
const restify_errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');
const controller = require('./src/controller');
const PORT = process.env.PORT;

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

server.get('/update/:groupName', async function onRequest (req, res, next) {
    const {
        groupName
    } = req.params;

    res.send(await controller.update(groupName));
});

server.get('/diffs/:groupName', async function onRequest (req, res, next) {
    const {
        groupName
    } = req.params;

    res.send(await controller.diffs(groupName));
});

server.get('/clear/:groupName', async function onRequest (req, res, next) {
    const {
        groupName
    } = req.params;

    res.send(await controller.clear(groupName));
});

/**
 * Serve static files
 */
server.get('/*', restify.plugins.serveStatic({
    directory: __dirname + '/public',
    default: 'index.html'
}));

module.exports = {
    server,
    listen: () => {
        return new Promise((resolve) => {
            server.listen(PORT, () => {
                console.log(`http://localhost:${PORT}/update/BookingCom`);
                console.log(`http://localhost:${PORT}/diffs/BookingCom`);
                console.log(`http://localhost:${PORT}/clear/BookingCom`);

                resolve();
            });
        });
    }
};
