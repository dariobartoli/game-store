const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')
const usersMiddleware = require('../middlewares/usersMiddleware')

router.use(usersMiddleware.userLogger)

router.post('/', usersController.add)
router.get('/', usersController.getAll)

module.exports = router