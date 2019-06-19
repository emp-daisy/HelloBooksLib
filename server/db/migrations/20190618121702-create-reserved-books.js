
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('reservedBooks', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    isbn: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    title: {
        type: Sequelize.STRING,
        allowNull: false
      },
    patronId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    collected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    timeToExpire: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
};
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('reservedBooks');
};