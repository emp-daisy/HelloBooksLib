export default (sequelize, DataTypes) => {
  const Authors = sequelize.define('Authors', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});

  Authors.associate = (models) => {
    Authors.hasMany(models.Books, {
      foreignKey: 'authorID',
      onDelete: 'CASCADE'
    });
  };

  return Authors;
};