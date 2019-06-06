/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    title: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    amount: {
      allowNull: false,
      type: DataTypes.NUMERIC
    },
    authorID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    reviewID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    },
    year: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};
