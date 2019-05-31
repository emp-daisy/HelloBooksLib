/* eslint-disable require-jsdoc */
import map from 'lodash/map';
import models from '../db/models';

export default async function truncate() {
  // eslint-disable-next-line no-return-await
  return await Promise.all(
    map(Object.keys(models), (key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return models[key].destroy({ where: {}, force: true });
    })
  );
}