/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize)  {
    return queryInterface.createTable('Borrowed_books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isbn: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateBorrowed: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dueDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      patronId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },      
      returned: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  }

export function down(queryInterface) {
  return queryInterface.dropTable('Borrowed_books');
}

