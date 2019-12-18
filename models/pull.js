module.exports = (sequelize, DataTypes) => {
  const Pull = sequelize.define('Pull', {
    trackId: DataTypes.INTEGER
  });

  Pull.associate = (models) => {
    models.Pull.belongsTo(models.Resource, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });

    models.Pull.hasMany(models.Content);
  };

  return Pull;
};
