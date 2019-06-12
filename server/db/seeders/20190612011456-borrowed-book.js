/* eslint-disable require-jsdoc */
const dateBorrowed = new Date();
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 3); 

export function up(queryInterface) {
  return queryInterface.bulkInsert(
    'Borrowed_books', 
    [
      {
        isbn: 44537,
        title: 'As a man thinketh',
        patronId: 4,
        cost: 10,
        dateBorrowed,
        dueDate
      },
      {
        isbn: 89374,
        title: 'You can Win',
        patronId: 4,
        cost: 10,
        dateBorrowed,
        dueDate
      },
      {
        isbn: 34454,
        title: 'Tender is the Night',
        patronId: 4,
        cost: 10,
        dateBorrowed,
        dueDate
      },
      
      {
        isbn: 43553,
        title: 'Tender is the Night',
        patronId: 5,
        cost: 10,
        dateBorrowed,
        dueDate: '2019-06-10 04:41:25.258+02'
      },

      
    ], {});
};

export function down(queryInterface) {
  return queryInterface.bulkDelete('Borrowed_books', null, {});
}



