/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/prefer-default-export
export function up(queryInterface, Sequelize) {
  return queryInterface.addColumn('Users', 'subscriptions', {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true
  });
}

export async function down(queryInterface) {
  return queryInterface.removeColumn('Users', 'subscriptions');
}
