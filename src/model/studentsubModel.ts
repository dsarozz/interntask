import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../dbConnection';
import { studentModel } from '../model/studentModel';
import { subjectModel } from '../model/subjectModel';

export interface studentsubjectAttributes {
    studentsubjectid: number;
    studentid: number;
    subjectid: number;
    marks: number;
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
    marks: {
        type: DataTypes.INTEGER
    }
    ,
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
    as: 'Subjects',
    foreignKey: 'studentid',
    // otherKey: 'subjectid'
})

subjectModel.belongsToMany(studentModel, {
    through: studentsubjectModel,
    as: 'Students',
    foreignKey: 'subjectid',
    // otherKey: 'studentid'
})