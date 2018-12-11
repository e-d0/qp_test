import * as Sequelize from "sequelize";
import { UserAttributes, UserInstance } from '../../models/User';

/**
 * Создаем тип, возвращаемый от БД, с перечислением атрибутов для каждой модели.
 * Дает возможность передавать объект БД в обработчики роутов.  
*/
export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  User: Sequelize.Model<UserInstance, UserAttributes>;
}