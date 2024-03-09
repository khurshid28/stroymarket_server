

const { Router } = require("express");

const router = Router();

let serviceController = require("../controllers/11.service");
const upload = require("../utils/upload");

router.post("/create",upload("public/service/").single("image"),serviceController.create);
router.get("/all",serviceController.all);
router.delete("/delete/:id",serviceController.delete);
// router.put("/:id",serviceController.edit);

module.exports = router;