import Favorito from '../models/Favoritos/Favorito.js';

export const getFavoritos = async (req, res) => {
    try {
        const favoritos = await Favorito.findAll();
        res.json(favoritos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los favoritos' });
    }
}

export const getFavorito = async (req, res) => {
    const favoritoId = req.params.id;
    if (isNaN(favoritoId)) {
        return res.status(400).json({ message: 'FavoritoId inválido' });
    }

    try {
        const favorito = await Favorito.findByPk(favoritoId);
        if (!favorito) {
            return res.status(404).json({ message: 'Favorito no encontrado' });
        }
        res.json(favorito);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el favorito' });
    }
}

export const createFavorito = async (req, res) => {
    try {
        const favorito = await Favorito.create(req.body);
        res.status(201).json(favorito);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el favorito' });
    }
}

export const updateFavorito = async (req, res) => {
    const favoritoId = req.params.id;

    try {
        const [updatedRows] = await Favorito.update(req.body, {
            where: { FavoriteId: favoritoId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Favorito no encontrado o sin cambios' });
        }

        res.json({ message: 'Favorito actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el favorito' });
    }
}

export const deleteFavorito = async (req, res) => {
    const favoritoId = req.params.id;

    try {
        const deletedRows = await Favorito.destroy({
            where: { FavoriteId: favoritoId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Favorito no encontrado' });
        }

        res.json({ message: 'Favorito eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el favorito' });
    }
}
