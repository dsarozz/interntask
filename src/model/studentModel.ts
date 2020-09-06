import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../dbConnection';

export interface studentAttributes {
    studentid: number;
    studentname: string;
    address: string;
    email: string;
    datecreated: Date;
    datemodified: Date;
    datedeleted: Date;
}

export interface studentCreationAttributes extends Optional<studentAttributes, 'studentid'> { }

export interface studentInstance extends Model<studentAttributes, studentCreationAttributes>, studentAttributes { }

export const studentModel = connection.define<studentInstance>('students', {
    studentid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentname: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    datecreated: {
        type: DataTypes.DATE,
    },
    datemodified: {
        type: DataTypes.DATE,
    },
    datedeleted: {
        type: DataTypes.DATE,
    }
}
    , {
        freezeTableName: true,
        timestamps: false
    })