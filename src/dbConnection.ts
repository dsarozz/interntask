import { Sequelize } from 'sequelize';
import * as dbConfig from './config';

export const connection = new Sequelize(dbConfig.dbName, dbConfig.userName, dbConfig.password, {
    dialect: 'postgres',
})