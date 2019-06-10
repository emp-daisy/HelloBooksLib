/* eslint-disable require-jsdoc */

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Categories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    category: {
      type: Sequelize.STRING,
    }
  });

}
export function down(queryInterface) {
  return queryInterface.dropTable('Categories');
}