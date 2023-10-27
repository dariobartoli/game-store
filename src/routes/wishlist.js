const express = require('express')
const router = express.Router()
const wishlistController = require('../controllers/wishlist')
const tokenAuth = require('../middlewares/tokenAuth')

router.use(tokenAuth.userVerify)

router.get('/', wishlistController.get)
router.post('/', wishlistController.add)
router.delete('/:id', wishlistController.remove)

module.exports = router