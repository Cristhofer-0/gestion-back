const { sequelize } = require('../config/bd');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();

class Usuario extends Sequelize.Model {
    static async comparePassword(password, hash) {
        const passworWithPepper = password + process.env.PEPPER;
        return await bcrypt.compare(passworWithPepper, hash);
    }
}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true, // Agregar timestamps (createdAt y updatedAt)
});
