module.exports = (sequelize, DataTypes) => {
  const Authors = sequelize.define('Authors', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});

  return Authors;
};