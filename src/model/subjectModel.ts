import { DataTypes, Model, Optional } from 'sequelize';
import { connection } from '../dbConnection';

export interface subjectAttributes {
    subjectid: number;
    subjectname: string;
    datecreated: Date;
    datemodified: Date;
    datedeleted: Date;
}

export interface subjectCreationAttributes extends Optional<subjectAttributes, 'subjectid'> { }

export interface subjectInstance extends Model<subjectAttributes, subjectCreationAttributes>, subjectAttributes { }

export const subjectModel = connection.define<subjectInstance>('subjects', {
    subjectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subjectname: {
        type: DataTypes.STRING,
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