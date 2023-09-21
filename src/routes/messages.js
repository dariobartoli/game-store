const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messages')
const tokenAuth = require('../middlewares/tokenAuth')
const messageMiddleware = require('../middlewares/messages')


router.use(tokenAuth.userVerify)
router.post('/', messageMiddleware.dataValidation, messageController.newMessage)
router.get('/all', messageController.allMessages)
router.get('/:id', messageController.getMessage)

module.exports = router