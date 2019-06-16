/* eslint-disable camelcase */
export default (sequelize, DataTypes) => {
  const RequestedBooks = sequelize.define('RequestedBooks', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    tags: DataTypes.STRING,
    author: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    categoryID: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {});

  return RequestedBooks;
};