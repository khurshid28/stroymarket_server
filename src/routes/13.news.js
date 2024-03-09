

const { Router } = require("express");

const router = Router();

let newsController = require("../controllers/13.news");
const upload = require("../utils/upload");

router.post("/create",upload("public/news/").single("image"),newsController.create);
router.get("/all",newsController.all);
router.delete("/delete/:id",newsController.delete);
// router.put("/:id",serviceController.edit);

module.exports = router;