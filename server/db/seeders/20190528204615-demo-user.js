/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import { config } from 'dotenv';

config();
export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert(
    'Users',
    [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        signupMethod: 'local',
        role: 'user',
        socialId: null,
        profilePic: null
      },
      {
          firstName: process.env.SUPER_ADMIN_FIRSTNAME,
          lastName: process.env.SUPER_ADMIN_LASTNAME,
          email: process.env.SUPER_ADMIN_EMAIL,
          password: process.env.SUPER_ADMIN_PASSWORD,
          signupMethod: 'local',
          role: 'super_admin',
          socialId: null,
          profilePic: null,
      }
    ],
    {}
  );
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropAllTables({});
}
