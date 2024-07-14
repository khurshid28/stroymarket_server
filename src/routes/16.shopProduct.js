const { Router } = require("express");

const router = Router();

let shopProductController = require("../controllers/16.shopProduct");

router.post("/create",shopProductController.create);
router.get("/all",shopProductController.all);
router.delete("/delete/:id",shopProductController.delete);
router.get("/all-in-product",shopProductController.getAllinProduct);
router.get("/:id",shopProductController.get);


module.exports = router;