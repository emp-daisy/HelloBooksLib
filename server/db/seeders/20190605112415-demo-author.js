/* eslint-disable require-jsdoc */
const date = new Date();
export function up(queryInterface) {
  return queryInterface.bulkInsert(
    'Authors', 
    [
      {
        firstName: 'Robert',
        middleName: 'Toru',
        lastName: 'Kiyosaki',
        createdAt: date,
        updatedAt: date
      }
    ], {});
};

export function down(queryInterface) {
  return queryInterface.bulkDelete('Authors', null, {});
}


