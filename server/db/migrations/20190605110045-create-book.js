/* eslint-disable require-jsdoc */

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    description: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    amount: {
      allowNull: false,
      type: Sequelize.NUMERIC
    },
    authorID: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Authors',
        key: 'id'
      }
    },
    categoryID: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    reviewID: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    status: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    year: {
      allowNull: false,
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
export function down(queryInterface) {
  return queryInterface.dropTable('Books');
}
