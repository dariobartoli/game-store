const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories')

router.get('/', categoriesController.get)
router.post('/', categoriesController.add)

module.exports = router