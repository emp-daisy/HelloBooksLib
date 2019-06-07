/* eslint-disable require-jsdoc */

export function up(queryInterface) {
  return queryInterface.bulkInsert(
    'Categories',
    [
      {
        category: 'Arts & Music'
      },
      {
        category: 'Programming'
      },
      {
        category: 'Business'
      },
      {
        category: 'Comics'
      },
      {
        category: 'Technology'
      },
      {
        category: 'Health & Fitness'
      },
      {
        category: 'Horror'
      },
      {
        category: 'Entertainment'
      },
      {
        category: 'Medical'
      },
      {
        category: 'Science'
      },
    ], {
      ignoreDuplicates: true
    });
  };

  export function down(queryInterface) {
      return queryInterface.bulkDelete('Categories', null, {});
  }