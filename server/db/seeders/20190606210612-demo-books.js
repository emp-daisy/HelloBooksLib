/* eslint-disable require-jsdoc */
const date = new Date();
  export function up(queryInterface) {
    return queryInterface.bulkInsert(
      'Books',
      [
        {
          title: 'Coding with one eye',
          description: 'This book teaches you how to code without really knowing what you are doing',
          amount: 3451,
          status: true,
          year: 2019,
          authorID: 1,
          categoryID: 1,
          createdAt: date,
          updatedAt: date
        }
      ],
     {});
    };

  export function down(queryInterface) {
    return queryInterface.bulkDelete('Books', null, {});
  }
