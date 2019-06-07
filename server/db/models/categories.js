
export default (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    category: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: false,
  });

  return Categories;
};