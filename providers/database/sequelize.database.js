const Sequelize = require('sequelize');
const models = require('models');
const Database = require('providers/database/database.abstract');

const DEFAULTS = {
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  // operatorsAliases: false
};

class SequelizeDatabase extends Database {
  async connect() {
    const { host, username, password, database } = this.connectConfig;

    const config = {
      ...DEFAULTS,
      ...this.provider === 'sqlite' ? { storage: host, host: 'localhost' } : { host },
      dialect: this.provider
    };

    const sequelize = new Sequelize(database, username, password, config);

    const loadedModels = await models(sequelize);

    // {force: true}
    await sequelize.sync();

    this.db = loadedModels;

    return this;
  }
}

module.exports = SequelizeDatabase;
