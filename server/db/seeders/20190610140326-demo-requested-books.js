/* eslint-disable require-jsdoc */
import faker from 'faker';

const date = new Date();
const seeds = 11;
let i;
const bookSeeds = [];
for (i = 0; i < seeds; i += 1) {
  bookSeeds.push({
    title: faker.random.words(),
    description: faker.lorem.sentence(),
    tags: faker.random.words(),
    author: faker.fake("{{name.lastName}} {{name.firstName}} {{name.lastName}}"),
    categoryID: faker.random.number({'min': 1, 'max': 10}),
    year: faker.random.number({'min': 1900, 'max': 2019}),
    userID: faker.random.number({'min': 1, 'max': 1}),
    createdAt: date,
    updatedAt: date
  });
}
export function up(queryInterface) {
  return queryInterface.bulkInsert('RequestedBooks', bookSeeds, {});
}

export function down(queryInterface) {
  return queryInterface.bulkDelete('RequestedBooks', null, {});
}

