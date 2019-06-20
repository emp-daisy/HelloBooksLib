export default (sequelize, DataTypes) => {
	const reservedBooks = sequelize.define('reservedBooks', {
		isbn: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		patronId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		collected: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		timeToExpire: {
			type: DataTypes.DATE,
			allowNull: false
		}

	}, {})

	reservedBooks.associate = function(models) {
		// associations can be defined here
	}

	return reservedBooks
}
