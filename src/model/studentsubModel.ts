import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { studentModel, studentAttributes, studentCreationAttributes, studentInstance } from '../model/studentModel';
import { subjectModel, subjectAttributes, subjectCreationAttributes, subjectInstance } from '../model/subjectModel';
import { connection } from '../dbConnection';

export interface studentsubjectAttributes {
    studentsubjectid: number;
    studentid: number;
    subjectid: number;
    datecreated: Date;
    datemodified: Date;
    datedeleted: Date;
}

export interface studentsubjectCreationAttributes extends Optional<studentsubjectAttributes, 'studentsubjectid'> { }

export interface studentsubjectInstance extends Model<studentsubjectAttributes, studentsubjectCreationAttributes>, studentsubjectAttributes { }

export const studentsubjectModel = connection.define<studentsubjectInstance>('studentsubjects', {
    studentsubjectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'subjects',
            key: 'subjectid',
        }
    },
    studentid: {
        type: DataTypes.INTEGER,
        references: {
            model: 'students',
            key: 'studentid',
        }
    },
    datecreated: {
        type: DataTypes.DATE,
    },
    datemodified: {
        type: DataTypes.DATE,
    },
    datedeleted: {
        type: DataTypes.DATE,
    },
}, {
    freezeTableName: true,
    timestamps: false
})