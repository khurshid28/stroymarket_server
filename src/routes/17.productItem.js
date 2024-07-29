

const { Router } = require("express");

const router = Router();

let ProductItemController = require("../controllers/17.productItem");
const upload = require("../utils/upload");

router.post("/create",upload("public/productitem/").single("image"),ProductItemController.create);
router.get("/all",ProductItemController.all);
router.get("/:id",ProductItemController.getbyId);
router.get("/",ProductItemController.getbyProductId);
router.delete("/delete/:id",ProductItemController.delete);
router.put("/:id",upload("public/productitem/").single("image"),ProductItemController.update);

module.exports = router;