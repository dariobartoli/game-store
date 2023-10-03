const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviews')
const reviewMiddleware = require('../middlewares/reviews')
const tokenAuth = require('../middlewares/tokenAuth')

router.use(tokenAuth.userVerify)

router.post('/', reviewMiddleware.dataValidation, reviewController.add)
router.get('/', reviewController.get)
router.delete('/', reviewController.remove)

module.exports = router