const { Router } = require("express");

const router = Router();

let phoneController =require("../controllers/phone")

router.post("/send",phoneController.phone);
router.post("/verify",phoneController.verify);

module.exports = router;