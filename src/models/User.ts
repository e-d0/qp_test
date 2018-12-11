import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from '../typings/SequelizeAttributes';

/**
 * Создаем тип для сущности User
*/
export interface UserAttributes {
    id?: number;
    name: string;
    age: number;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
};

/**
 * Создаем тип для User записи из текущей записи БД
*/
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
};

/**
 * задает модель для таблицы БД User
*/
export const UserFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    name: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.TINYINT
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  };

  const User = sequelize.define<UserInstance, UserAttributes>('User', attributes);

  return User;
};