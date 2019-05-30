/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    password: 'password'
  }], {});
}
export function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Users', null, {});
}
