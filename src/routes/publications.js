const express = require('express')
const router = express.Router()
const publicationController = require('../controllers/publications')
const tokenAuth = require('../middlewares/tokenAuth')
const publicationMiddleware = require('../middlewares/publications')


router.get('/', publicationController.getAll)
router.use(tokenAuth.userVerify)

router.post('/', publicationMiddleware.dataValidation, publicationController.create)
router.put('/', publicationController.set)
router.delete('/', publicationController.delet)



module.exports = router