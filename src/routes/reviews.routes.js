import {Router} from 'express'
import {createReview, updateReview, getReviews, getReview, deleteReview} from '../controllers/reviews.controllers.js'

const router = Router()

router.get('/reviews', getReviews)

router.get('/reviews/:id', getReview)

router.post('/reviews', createReview)

router.put('/reviews/:id', updateReview)

router.delete('/reviews/:id', deleteReview)

export default router