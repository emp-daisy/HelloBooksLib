/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/prefer-default-export
export async function up(queryInterface, Sequelize) {
  return [
    await queryInterface.addColumn('Books', 'tags', {
      type: Sequelize.STRING,
      allowNull: false
    })
  ];
}

export async function down(queryInterface) {
  return [
    await queryInterface.removeColumn('Books', 'tags')
  ];
}