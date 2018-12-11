import { DataTypeAbstract, DefineAttributeColumnOptions } from "sequelize";

/**
 * Создаем обобщенный тип, чтобы проверять передаваемые в бд объекты на типы.  
*/
type SequelizeAttribute = string | DataTypeAbstract | DefineAttributeColumnOptions;

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: SequelizeAttribute
};