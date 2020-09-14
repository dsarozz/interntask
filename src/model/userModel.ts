import * as bcrypt from 'bcrypt';
import { DataTypes, Model, Optional } from 'sequelize';
import { Hooks } from 'sequelize/types/lib/hooks';
import { connection } from '../dbConnection';
const saltRounds = 8;


export interface userAttributes {
    userid: number;
    username: string;
    password: string;
    authkey: string;
    authkeyexpire: Date;
    firstname: string;
    lastname: string;
    datecreated: Date;
    datemodified: Date;
    datedeleted: Date;
}

export interface userCreationAttributes extends Optional<userAttributes, 'userid'> { }

export interface userInstance extends Model<userAttributes, userCreationAttributes>, userAttributes { }

export const userModel = connection.define<userInstance>('users', {
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    authkey: {
        type: DataTypes.UUID
    },
    authkeyexpire: {
        type: DataTypes.DATE
    },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    datecreated: {
        type: DataTypes.DATE
    },
    datemodified: {
        type: DataTypes.DATE
    },
    datedeleted: {
        type: DataTypes.DATE
    }
}
    , {
        freezeTableName: true,
        timestamps: false
    }
)

userModel.beforeCreate(function (user, options) {
    return bcrypt.hash(user.password, saltRounds).then(hashedPassword => {
        user.password = hashedPassword
    })
})