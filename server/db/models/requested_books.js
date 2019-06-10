/* eslint-disable camelcase */
export default (sequelize, DataTypes) => {
  const Requested_Books = sequelize.define('Requested_Books', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    author: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    categoryID: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {});

  return Requested_Books;
};