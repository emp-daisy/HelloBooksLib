/* eslint-disable no-unused-vars */
const date = new Date();
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Authors', 
      [
        {
          firstName: 'Robert',
          lastName: 'Kiyosaki',
          createdAt: date,
          updatedAt: date
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Authors', null, {});
  }
};