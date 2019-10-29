require('dotenv').config();
const database = require('./database');
const routing = require('./routing');

database.sync().then((database) => {
    routing.listen();
});


