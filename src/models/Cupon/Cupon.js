import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Coupon =sequelize.define( 'Coupon',{
    CouponId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    DiscountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    ValidFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ValidUntil: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    MaxUses: DataTypes.INTEGER,
    UsedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {

    tableName: 'Coupons',
    timestamps: false,
});

export default Coupon;