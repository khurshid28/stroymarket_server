

const { Router } = require("express");

const router = Router();

let regionController = require("../controllers/15.region");

router.post("/create",regionController.create);
router.get("/all",regionController.all);
router.delete("/delete/:id",regionController.delete);
// router.put("/:id",serviceController.edit);

module.exports = router;