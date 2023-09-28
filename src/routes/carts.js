const express = require('express')
const router = express.Router()
const cartController = require('../controllers/carts')
const tokenAuth = require('../middlewares/tokenAuth')

router.use(tokenAuth.userVerify)
router.post('/', cartController.addToCart)
router.delete('/clean', cartController.cleanCart)
router.delete('/', cartController.removeToCart)
router.get('/', cartController.getCart)
router.post('/purchase', cartController.purchase)


module.exports = router