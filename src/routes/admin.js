const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin')
const tokenAuth = require('../middlewares/tokenAuth')



router.use(tokenAuth.userVerify)
router.use(tokenAuth.admin)

router.get('/', adminController.get)
router.post('/disabled/user', adminController.disabledUser)
router.post('/disabled/publication', adminController.disabledPublication)

module.exports = router;