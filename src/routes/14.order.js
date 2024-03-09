const { Router } = require("express");

const router = Router();
let checkToken =require("../middlewares/check-token")
let orderController = require("../controllers/14.order");
const upload = require("../utils/upload");

router.post("/create",checkToken, orderController.create);
router.post("/finish/:id",checkToken,orderController.finish);
router.get("/confirm/:id",checkToken,orderController.confirm);
router.get("/all",checkToken,orderController.all);
router.get("/:id",checkToken,orderController.getbyId);
router.delete("/delete/:id",checkToken,orderController.delete);
// router.put("/:id",serviceController.edit);

module.exports = router;