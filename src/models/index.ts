import Sequelize from 'sequelize';
import { DbInterface } from'typings/DbInterface';
import { UserFactory } from './User';

/**
 * Создает соеднинение с БД и задает необходимые параметры
 */
export const createModels = (): DbInterface => {
  const Op = Sequelize.Op;
  const sequelize = new Sequelize('database', null, null , {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: 'db.sqlite3',
    operatorsAliases: { $and: Op.and },
    logging: false
    })

  const db: DbInterface = {
    sequelize,
    Sequelize,
    User: UserFactory(sequelize, Sequelize)
  };

  return db;
};