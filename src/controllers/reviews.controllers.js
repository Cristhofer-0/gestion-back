import Review from '../models/Revision/Review.js';

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reviews' });
    }
}
export const getReview = async (req, res) => {
    const reviewId = req.params.id;
    if (isNaN(reviewId)) {
        return res.status(400).json({ message: 'ReviewId inválido' });
    }

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review no encontrado' });
        }
        res.json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el review' });
    }
}

export const createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el review' });
    }
}

export const updateReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const [updatedRows] = await Review.update(req.body, {
            where: { ReviewId: reviewId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Review no encontrado o sin cambios' });
        }

        res.json({ message: 'Review actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el review' });
    }

}

export const deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const deletedRows = await Review.destroy({
            where: { ReviewId: reviewId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Review no encontrado' });
        }

        res.json({ message: 'Review eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el review' });
    }
}