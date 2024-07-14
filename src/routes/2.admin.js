

const { Router } = require("express");

const router = Router();

let checkToken =require("../middlewares/check-token")

let adminController = require("../controllers/2.admin")

router.post("/create",adminController.create);
router.get("/all",adminController.all);
router.delete("/delete/:id",adminController.delete);
router.get("/profile",checkToken,adminController.profile);
router.get("/:id",adminController.get);




module.exports = router;