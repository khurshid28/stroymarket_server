

const { Router } = require("express");

const router = Router();

let ShopProductItemController = require("../controllers/18.shopproductItem.js");
let checkToken= require("../middlewares/check-token")
router.use(checkToken)
router.post("/create",ShopProductItemController.create);
router.get("/all",ShopProductItemController.all);
router.get("/:id",ShopProductItemController.getbyId);
router.get("/",ShopProductItemController.getbyProductId);
router.delete("/delete/:id",ShopProductItemController.delete);
router.put("/:id",ShopProductItemController.update);

module.exports = router;