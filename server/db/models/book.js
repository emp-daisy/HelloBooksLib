/* eslint-disable func-names */
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
    reviewID: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    categoryID: {
      allowNull: false,
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
  
  Books.associate = (models) => {
    Books.belongsTo(models.Authors, {
      foreignKey: 'authorID',
      onDelete: 'CASCADE'
    });
  };
  return Books;
};
