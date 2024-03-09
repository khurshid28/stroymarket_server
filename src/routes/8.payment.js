

const { Router } = require("express");

const router = Router();

let paymentController = require("../controllers/8.payment");

router.post("/admin-and-shop",paymentController.adminAndShop);
router.post("/worker",paymentController.worker);
router.post("/ads",paymentController.ads);
router.get("/all",paymentController.all);



module.exports = router;