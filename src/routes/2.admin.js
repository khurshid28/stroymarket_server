

const { Router } = require("express");

const router = Router();



let adminController = require("../controllers/2.admin")

router.post("/create",adminController.create);
router.get("/all",adminController.all);
router.delete("/delete/:id",adminController.delete);
router.get("/:id",adminController.get);

module.exports = router;