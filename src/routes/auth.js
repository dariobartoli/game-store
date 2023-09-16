const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const usersMiddleware = require('../middlewares/users')

router.post('/register', usersMiddleware.dataValidation, authController.register)
router.post('/login', authController.login)

module.exports = router

