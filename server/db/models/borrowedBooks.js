/* eslint-disable camelcase */
export default (sequelize, DataTypes) => {
  const BorrowedBooks = sequelize.define('BorrowedBooks', {
    isbn: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    dateBorrowed: {
      allowNull: false,
      type: DataTypes.DATE
    },
    dueDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    patronId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    returned: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },  
  }, {timestamps: false});

  return BorrowedBooks;
};