class Database {
  constructor(provider, connectConfig) {
    this.provider = provider;
    this.connectConfig = connectConfig;
    this.db;
  }

  async connect() {
    throw new Error('Method must be implemented');
  }

  get() {
    return this.db;
  }
}

module.exports = Database;
