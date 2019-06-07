
/* eslint-disable require-jsdoc */
import faker from 'faker';

const date = new Date();
const seeds = 500;
let i;
const bookSeeds = [];
for (i = 0; i < seeds; i += 1) {
  bookSeeds.push({
    title: faker.random.words(),
    description: faker.lorem.sentence(),
    amount: faker.commerce.price(),
    authorID: 1,
    status: faker.random.boolean(),
    categoryID: faker.random.number({'min': 1, 'max': 10}),
    year: faker.random.number({'min': 1900, 'max': 2019}),
    createdAt: date,
    updatedAt: date
  });
}
export function up(queryInterface) {
  return queryInterface.bulkInsert('Books', bookSeeds, {});
}

export function down(queryInterface) {
  return queryInterface.bulkDelete('Books', null, {});
}
