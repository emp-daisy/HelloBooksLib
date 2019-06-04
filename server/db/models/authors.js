'use strict';
module.exports = (sequelize, DataTypes) => {
  const Authors = sequelize.define('Authors', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  Authors.associate = function(models) {
    // associations can be defined here
  };
  return Authors;
};