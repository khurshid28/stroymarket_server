

const { Router } = require("express");

const router = Router();

let productController = require("../controllers/7.product");
const upload = require("../utils/upload");

router.post("/create",upload("public/product/").single("image"),productController.create);
router.get("/all",productController.all);
router.get("/",productController.getbyCategoryId);
router.delete("/delete/:id",productController.delete);
// router.put("/:id",categoryController.edit);

module.exports = router;