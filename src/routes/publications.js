const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publications");
const tokenAuth = require("../middlewares/tokenAuth");
const publicationMiddleware = require("../middlewares/publications");
const multerMiddleware = require('../middlewares/multer');



router.get("/all", publicationController.getAll);
router.use(tokenAuth.userVerify);

router.get("/", publicationController.get)
router.post("/", multerMiddleware.uploadMulti, publicationController.create);
router.put("/", publicationController.set);
router.delete("/", publicationController.delet);
router.post('/like', publicationController.addLike)
router.post('/comment', publicationMiddleware.commentValidation, publicationController.addComment)


module.exports = router;
