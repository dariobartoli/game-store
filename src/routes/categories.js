const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories')
const categoriesMiddleware = require('../middlewares/categories')

router.get('/', categoriesController.get)
router.post('/', categoriesMiddleware.dataValidation, categoriesController.add)

module.exports = router