const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviews')
const tokenAuth = require('../middlewares/tokenAuth')

router.use(tokenAuth.userVerify)

router.post('/', reviewController.add)
router.get('/', reviewController.get)

module.exports = router