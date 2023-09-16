const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')
const usersMiddleware = require('../middlewares/users')
const tokenAuth = require('../middlewares/tokenAuth')

router.use(usersMiddleware.userLogger)
router.get('/all', usersController.getAll)

router.use(tokenAuth.userVerify)
router.get('/', usersController.get)

module.exports = router