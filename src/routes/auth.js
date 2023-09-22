const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const usersMiddleware = require('../middlewares/users')
const tokenAuth = require('../middlewares/tokenAuth')

router.post('/register', usersMiddleware.dataValidation, authController.register)
router.post('/login', authController.login)

router.use(tokenAuth.userVerify)
router.post('/logout', authController.logout)

module.exports = router

