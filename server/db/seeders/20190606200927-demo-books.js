/* eslint-disable require-jsdoc */
import faker from 'faker';

const date = new Date();
const seeds = 500;
const status = ['Available', 'Borrowed'];
let i;
const bookSeeds = [
  {
    title: faker.random.words(),
    description: faker.lorem.sentence(),
    tags: faker.random.words(),
    amount: 2000,
    authorID: 1,
    status: 'Borrowed',
    categoryID: 3,
    year: 2018,
    isbn: 1034564,
    createdAt: date,
    updatedAt: date
  },
  {
    title: faker.random.words(),
    description: faker.lorem.sentence(),
    tags: faker.random.words(),
    amount: 2000,
    authorID: 1,
    status: 'Borrowed',
    categoryID: 3,
    year: 2018,
    isbn: 1034565,
    createdAt: date,
    updatedAt: date
  },
  {
    title: faker.random.words(),
    description: faker.lorem.sentence(),
    tags: faker.random.words(),
    amount: 2000,
    authorID: 1,
    status: 'Available',
    categoryID: 3,
    year: 2018,
    isbn: 1034574,
    createdAt: date,
    updatedAt: date
  }
];
for (i = 0; i < seeds; i += 1) {
  bookSeeds.push({
    title: faker.random.words(),
    description: faker.lorem.sentence(),
    tags: faker.random.words(),
    amount: faker.commerce.price(),
    authorID: 1,
    status: status[Math.floor(Math.random() * status.length)],
    categoryID: faker.random.number({ min: 1, max: 10 }),
    year: faker.random.number({ min: 1900, max: 2019 }),
    isbn: faker.random.number({ min: 1934564, max: 3934564 }),
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
