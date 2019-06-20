/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/prefer-default-export
export async function up(queryInterface, Sequelize) {
  return [
    await queryInterface.addColumn('Users', 'favouriteAuthors', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true
    })
  ];
}

export async function down(queryInterface) {
  return [await queryInterface.removeColumn('Users', 'favouriteAuthors')];
}
