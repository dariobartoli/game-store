const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publications");
const tokenAuth = require("../middlewares/tokenAuth");
const publicationMiddleware = require("../middlewares/publications");
const multerMiddleware = require('../middlewares/multer');



router.get("/all", publicationController.getAll);
router.use(tokenAuth.userVerify);

router.get("/", publicationController.get)
router.get("/:id", publicationController.getOnePublication)
router.post("/", multerMiddleware.uploadMulti, publicationMiddleware.dataValidation, publicationController.create);
router.put("/", publicationController.set);
router.put("/show", publicationController.setShow)
router.delete("/:id", publicationController.delet);
router.post('/like', publicationController.addLike)
router.post('/comment', publicationMiddleware.commentValidation, publicationController.addComment)
router.put('/comment/remove', publicationController.deletComment)


module.exports = router;
