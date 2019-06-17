/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize){
    return queryInterface.createTable('RequestedBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      categoryID: {
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }

  export function down(queryInterface){
    return queryInterface.dropTable('RequestedBooks');
  }
