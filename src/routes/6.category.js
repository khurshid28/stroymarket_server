

const { Router } = require("express");

const router = Router();

let categoryController = require("../controllers/6.category");
const upload = require("../utils/upload");

router.post("/create",upload("public/category/").single("image"),categoryController.create);
router.get("/all",categoryController.all);
router.delete("/delete/:id",categoryController.delete);
// router.put("/:id",categoryController.edit);

module.exports = router;