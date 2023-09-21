const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publications");
const tokenAuth = require("../middlewares/tokenAuth");
const publicationMiddleware = require("../middlewares/publications");


router.get("/all", publicationController.getAll);
router.use(tokenAuth.userVerify);

router.get("/", publicationController.get)
router.post("/", publicationController.create);
router.put("/", publicationController.set);
router.delete("/", publicationController.delet);

router.post("/probando",publicationMiddleware.upload,publicationController.probando);

module.exports = router;
