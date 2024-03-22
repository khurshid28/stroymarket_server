const { Router } = require("express");

const router = Router();

let orderController = require("../controllers/14.order");
const upload = require("../utils/upload");

router.post("/create", orderController.create);
router.post("/finish/:id",orderController.finish);
router.post("/cancel/:id",orderController.cancel);
router.post("/confirm/:id",orderController.confirm);
router.get("/all",orderController.all);
router.get("/:id",orderController.getbyId);
router.delete("/delete/:id",orderController.delete);
// router.put("/:id",serviceController.edit);

module.exports = router;