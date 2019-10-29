const Sequelize = require('sequelize');

let sequelize = new Sequelize('database', 'username', 'password', {host: 'localhost',dialect: 'sqlite',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // SQLite only
    storage: __dirname + '/database.sqlite',
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const database = {
    models: {
        contents: {
            group: Sequelize.STRING,
            category: Sequelize.STRING,
            link: Sequelize.STRING,
            trackId: Sequelize.STRING,
            sha256: Sequelize.STRING,
            content: Sequelize.STRING
        }
    },
    sequelize
};


for (let i in database.models) {
    database.models[i] = sequelize.define(i, database.models[i]);
}

database.sync = function() {
    // {force: true}
    return sequelize.sync();
};



module.exports = database;
