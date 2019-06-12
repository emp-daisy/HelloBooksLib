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
        password:
          '$2a$06$6.KeIwVJGmNJzuaQU4QC5eQScPh0HrIWmxZl1f7IlrQTLDw.Jz5Qi',
        signupMethod: 'local',
        role: 'user',
        socialId: null,
        profilePic: null
      },
      {
        firstName: 'Jude',
        lastName: 'Violet',
        email: 'judeviolet@gmail.com',
        password:
          '$2a$06$6.KeIwVJGmNJzuaQU4QC5eQScPh0HrIWmxZl1f7IlrQTLDw.Jz5Qi',
        signupMethod: 'local',
        socialId: null,
        profilePic: null,
        role: 'super_admin'
      }
    ],
    {}
  );
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropAllTables({});
}
