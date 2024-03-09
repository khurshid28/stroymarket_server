

const { Router } = require("express");

const router = Router();

let superController = require("../controllers/4.super")

router.post("/create",superController.create);
router.get("/all",superController.all);
router.delete("/delete/:id",superController.delete);

module.exports = router;