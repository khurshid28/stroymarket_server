const { Router } = require("express");


const router = Router();

let shopController =require("../controllers/shop")

router.get("/",shopController.getAll);


module.exports = router;