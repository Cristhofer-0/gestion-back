import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const User = sequelize.define('User', {
	UserId: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	FullName: {
		type: DataTypes.STRING(150),
		allowNull: false,
	},
	BirthDate: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	Phone: {
		type: DataTypes.STRING(20),
		allowNull: false,
	},
	DNI: {
		type: DataTypes.STRING(20),
		allowNull: false,
		unique: true,
	},
	Email: {
		type: DataTypes.STRING(100),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
		},
	},
	PasswordHash: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	Role: {
		type: DataTypes.ENUM('user', 'organizer', 'admin'),
		allowNull: false,
	}
}, {
	tableName: 'Users',
	timestamps: false,
});

export default User;