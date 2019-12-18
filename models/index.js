const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

module.exports = async (sequelize) => {
  const models = fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    });

  models.forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));

    db[model.name] = model;
  });

  // The association is made once all the models are loaded, can't be done before
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
