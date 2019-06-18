/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/prefer-default-export
export async function up(queryInterface, Sequelize) {
  return [
    await queryInterface.addColumn('RequestedBooks', 'tags', {
      type: Sequelize.STRING,
      allowNull: false
    })
  ];
}

export async function down(queryInterface) {
  return [
    await queryInterface.removeColumn('RequestedBooks', 'tags')
  ];
}