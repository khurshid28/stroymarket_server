const { Router } = require("express");


const router = Router();
const upload = require("../utils/upload");
let shopController =require("../controllers/5.shop")

router.get("/all",shopController.all);
router.get("/by-product",shopController.getByProductId);
router.get("/:id",shopController.getById);
router.post("/:id/addProduct",shopController.addProduct);
router.post("/:id/changeTypes",shopController.changeTypes);
router.post("/create",upload("public/shop/").single("image"),shopController.create);

router.delete("/delete/:id",shopController.delete);
router.put("/:id",upload("public/shop/").single("image"),shopController.update);


module.exports = router;