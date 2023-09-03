const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController')
const productMiddleware = require('../middlewares/productsMiddleware')

router.use(productMiddleware.productLogger)
router.get('/', productController.getAll)
router.post('/',productMiddleware.dataValidation , productController.add)
router.delete('/:id',productMiddleware.isAlphaNum, productController.del)
router.put('/:id',productMiddleware.isAlphaNum, productMiddleware.dataValidation, productController.set)
router.get('/product/:id',productMiddleware.isAlphaNum, productController.get)


module.exports = router;