const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')
const usersMiddleware = require('../middlewares/usersMiddleware')

router.use(usersMiddleware.userLogger)

router.post('/', usersMiddleware.dataValidation, usersController.add)
router.get('/', usersController.getAll)
router.get('/login', usersController.login)

module.exports = router