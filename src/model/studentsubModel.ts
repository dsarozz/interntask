import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../dbConnection';
import { studentModel } from '../model/studentModel';
import { subjectModel } from '../model/subjectModel';

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

studentModel.belongsToMany(subjectModel, {
    through: studentsubjectModel,
    as: 'subjects',
    foreignKey: 'studentid',
    // otherKey: 'subjectid'
})

subjectModel.belongsToMany(studentModel, {
    through: studentsubjectModel,
    as: 'students',
    foreignKey: 'subjectid',
    // otherKey: 'studentid'
})

