/* eslint-disable func-names */
/* eslint-disable no-unused-vars */

export default (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    category: {
      type: DataTypes.STRING,
      unique: true
    }
  }
  , {
    timestamps: false,
  });

  Categories.associate = function(models) {
 
  };
  return Categories;
};