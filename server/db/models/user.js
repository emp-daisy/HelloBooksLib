/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      signupMethod: {
        type: DataTypes.ENUM('local', 'google', 'facebook', 'twitter'),
        allowNull: false
      },
      socialId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email_confirm_code: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  // eslint-disable-next-line no-unused-vars
  Users.associate = models => {
    // associations can be defined here
  };
  return Users;
};
