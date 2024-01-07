const express = require('express')
const router = express.Router()
const BackgroundController = require('../controllers/background')
const BackgroundMiddleware = require('../middlewares/background')
const tokenAuth = require('../middlewares/tokenAuth')

router.post('/', BackgroundMiddleware.dataValidation, BackgroundController.addBackground)

router.use(tokenAuth.userVerify)
router.post('/change', BackgroundController.changeBackground)

module.exports = router
