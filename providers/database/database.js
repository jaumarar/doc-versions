const {
  database: {
    provider,
    connection
  }
} = require('config');

const providerToLoad = [
  'mysql',
  'mariadb',
  'sqlite',
  'postgres',
  'mssql'
].includes(provider) ? 'sequelize' : provider;


const ProviderClass = require(`providers/database/${providerToLoad}.database`);

const database = new ProviderClass(provider, connection);

module.exports = database;
