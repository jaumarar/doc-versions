module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    code: DataTypes.STRING,
    baseUri: DataTypes.STRING
  });

  Resource.associate = (models) => {
    models.Resource.hasMany(models.Pull);
  };

  return Resource;
};
