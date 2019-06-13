/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/prefer-default-export
export async function up(queryInterface, Sequelize) {
  return [
    await queryInterface.addColumn('BorrowedBooks', 'fineAmount', {
      type: Sequelize.INTEGER,
      allowNull: true
    }),
    await queryInterface.addColumn('BorrowedBooks', 'fineStatus', {
      type: Sequelize.STRING,
      allowNull: true
    })
  ];
}

export async function down(queryInterface) {
  return [
    await queryInterface.removeColumn('BorrowedBooks', 'fineAmount'),
    await queryInterface.removeColumn('BorrowedBooks', 'fineStatus')
  ];
}
