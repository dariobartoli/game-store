const express = require('express')
const router = express.Router()
const cartController = require('../controllers/carts')
const tokenAuth = require('../middlewares/tokenAuth')

router.use(tokenAuth.userVerify)
router.post('/', cartController.addToCart)
router.delete('/clean', cartController.cleanCart)
router.delete('/purchase', cartController.purchase)
router.delete('/:id', cartController.removeToCart)
router.get('/', cartController.getCart)


module.exports = router