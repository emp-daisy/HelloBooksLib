/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import auth from '../../helpers/auth';


const password = auth.hashPassword('PassWord123..');

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
          firstName: 'super',
          lastName: 'admin',
          email: 'super_admin@test.com',
          password,
          signupMethod: 'local',
          role: 'super_admin',
          socialId: null,
          profilePic: null,
      },      
      {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@test.com',
        password,
        signupMethod: 'local',
        role: 'admin',
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
