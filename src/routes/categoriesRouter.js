const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController')

router.get('/', categoriesController.get)
router.post('/', categoriesController.add)

module.exports = router