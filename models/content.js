module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define('Content', {
    category: DataTypes.STRING,
    url: DataTypes.STRING,
    sha256: DataTypes.STRING,
    content: DataTypes.STRING
  });

  Content.associate = (models) => {
    models.Content.belongsTo(models.Pull, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Content;
};
