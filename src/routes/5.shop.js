const { Router } = require("express");


const router = Router();
const upload = require("../utils/upload");
let shopController =require("../controllers/5.shop")

router.get("/",shopController.all);
router.post("/create",upload("public/shop/").single("image"),shopController.create);


module.exports = router;