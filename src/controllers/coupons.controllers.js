import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const getCupones = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query("SELECT * FROM Coupons")
    res.json(result.recordset)
}

export const getCupon = async (req, res) => {
    const couponId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('CouponId', sql.Int, couponId)
            .query('SELECT * FROM Coupons WHERE CouponId = @CouponId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Cupon no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el cupon" });
    }
}

export const createCupon = async (req, res)  => {
    try {
        const pool = await getConnection()

        const result = await pool
            .request()
            .input('Code', sql.NVarChar(50), req.body.Code)
            .input('DiscountPercentage', sql.Decimal(5, 2), req.body.DiscountPercentage)
            .input('ValidFrom', sql.Date, req.body.ValidFrom)
            .input('ValidUntil', sql.Date, req.body.ValidUntil)
            .input('MaxUses', sql.Int, req.body.MaxUses)
            .input('UsedCount', sql.Int, req.body.UsedCount)
            .query(`
                INSERT INTO Coupons (Code, DiscountPercentage, ValidFrom, ValidUntil, MaxUses, UsedCount)
                VALUES (@Code, @DiscountPercentage, @ValidFrom, @ValidUntil, @MaxUses, @UsedCount)
            `);

        res.status(201).json({
            Code: req.body.Code,
            DiscountPercentage: req.body.DiscountPercentage,
            ValidFrom: req.body.ValidFrom,
            ValidUntil: req.body.ValidUntil,
            MaxUses: req.body.MaxUses,
            UsedCount: req.body.UsedCount,
        });
    } catch (error) {
        console.error("Error al crear el nuevo cupon:", error);
        res.status(500).json({ message: "Error al crear el nuevo cupon" });
    }
}

export const updateCupon = async (req, res) => {
    const couponId = req.params.id;
    const {
        Code,
        DiscountPercentage,
        ValidFrom,
        ValidUntil,
        MaxUses,
        UsedCount,
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('CouponId', sql.Int, couponId)
            .input('Code', sql.NVarChar(50),Code)
            .input('DiscountPercentage', sql.Decimal(5, 2),DiscountPercentage)
            .input('ValidFrom', sql.Date,ValidFrom)
            .input('ValidUntil', sql.Date,ValidUntil)
            .input('MaxUses', sql.Int,MaxUses)
            .input('UsedCount', sql.Int,UsedCount)
            .query(`
                UPDATE Coupons
                SET Code = @Code,
                    DiscountPercentage = @DiscountPercentage,
                    ValidFrom = @ValidFrom,
                    ValidUntil = @ValidUntil,
                    MaxUses = @MaxUses,
                    UsedCount = @UsedCount
                WHERE CouponId = @CouponId
            `);

        res.status(200).json({ message: "Cupon actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el cupon" });
    }
}

export const deleteCupon = async (req, res) => {
    const couponId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('CouponId', sql.Int, couponId)
            .query('DELETE FROM Coupons WHERE CouponId = @CouponId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Cupon no encontrado" });
        }

        res.json({ message: "Cupon eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el cupon" });
    }
}