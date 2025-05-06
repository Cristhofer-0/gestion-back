import Cupon from '../models/Cupon/Cupon.js';

export const getCupones = async (req, res) => {
    try {
        const cupons = await Cupon.findAll();
        res.json(cupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los cupons' });
    }
}

export const getCupon = async (req, res) => {
    const cuponId = req.params.id;
    if (isNaN(cuponId)) {
        return res.status(400).json({ message: 'CuponId inválido' });
    }

    try {
        const cupon = await Cupon.findByPk(cuponId);
        if (!cupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }
        res.json(cupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el cupón' });
    }
}

export const createCupon = async (req, res) => {
    try {
        const cupon = await Cupon.create(req.body);
        res.status(201).json(cupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el cupón' });
    }
}

export const updateCupon = async (req, res) => {
    const cuponId = req.params.id;

    try {
        const [updatedRows] = await Cupon.update(req.body, {
            where: { CouponId: cuponId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Cupón no encontrado o sin cambios' });
        }

        res.json({ message: 'Cupón actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el cupón' });
    }
}

export const deleteCupon = async (req, res) => {
    const cuponId = req.params.id;

    try {
        const deletedRows = await Cupon.destroy({
            where: { CouponId: cuponId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }

        res.json({ message: 'Cupón eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el cupón' });
    }
}
