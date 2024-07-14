

const { Router } = require("express");

const router = Router();

let productController = require("../controllers/7.product");
const upload = require("../utils/upload");

router.post("/create",upload("public/product/").single("image"),productController.create);
router.post("/add/:id",productController.add);
router.get("/all",productController.all);
router.get("/more",productController.moreAll);
router.get("/",productController.getbyCategoryId);
router.get("/:id",productController.getbyId);
router.delete("/:id",productController.delete);
router.delete("/:id/:item_id",productController.deleteItem);
// router.put("/:id",categoryController.edit);

module.exports = router;