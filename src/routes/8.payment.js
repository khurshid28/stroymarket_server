

const { Router } = require("express");

const router = Router();

let paymentController = require("../controllers/8.payment");

router.post("/admin-and-shop",paymentController.adminAndShop);
router.post("/worker",paymentController.worker);
router.post("/ads",paymentController.ads);
router.get("/all",paymentController.all);
router.delete("/delete/:id",paymentController.delete);
router.put("/:id",paymentController.update);


module.exports = router;