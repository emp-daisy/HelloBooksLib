import Umzug from 'umzug';
import db from './models/index';

const { Sequelize, sequelize } = db;
const migrateModels = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize // here should be a sequelize instance, not the Sequelize module
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize // Sequelize constructor - the required module
    ],
    path: `${__dirname}/./migrations`,
    pattern: /\.js$/
  }
});

const migrateSeeders = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize // here should be a sequelize instance, not the Sequelize module
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize // Sequelize constructor - the required module
    ],
    path: `${__dirname}/./seeders`,
    pattern: /\.js$/
  }
});

export { migrateModels, migrateSeeders };
