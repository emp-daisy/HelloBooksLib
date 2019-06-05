const date = new Date();
module.exports = {
  up: (queryInterface) => {
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

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Authors', null, {});
  }
};