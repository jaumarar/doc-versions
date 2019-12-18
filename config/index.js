const {
  PORT = 9500,
  DB_PROVIDER = 'sqlite',
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_DATABASE
} = process.env;

module.exports = {
  port: PORT,
  database: {
    provider: DB_PROVIDER,
    connection: {
      host: DB_HOST,
      username: DB_USER,
      password: DB_PASS,
      database: DB_DATABASE
    }
  }
};
