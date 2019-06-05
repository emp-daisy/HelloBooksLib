export default (sequelize, DataTypes) => {
  const Authors = sequelize.define('Authors', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});

  return Authors;
};