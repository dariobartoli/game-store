const express = require('express');
const router = express.Router();
const productController = require('../controllers/products')
const productMiddleware = require('../middlewares/products')
const multerMiddleware = require('../middlewares/multer')
const tokenAuth = require('../middlewares/tokenAuth')


router.use(productMiddleware.productLogger)
router.get('/', productController.getAll)
router.post('/', multerMiddleware.upload, productMiddleware.dataValidation, productController.add)
router.get('/library/:id', productController.userProducts)
router.delete('/:id',productMiddleware.isAlphaNum, productController.del)
router.put('/:id', multerMiddleware.upload, productController.set)
router.get('/product/:id',productMiddleware.isAlphaNum, productController.get)
router.post('/images', multerMiddleware.uploadMulti, productController.addImages)



module.exports = router;