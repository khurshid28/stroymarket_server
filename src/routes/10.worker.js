

const { Router } = require("express");

const router = Router();

let workerController = require("../controllers/10.workers");
const upload = require("../utils/upload");

router.post("/create",upload("public/worker/").single("image"),workerController.create);
router.get("/all",workerController.all);
router.get("/",workerController.getbyServiceId);
router.delete("/:id",workerController.delete);
router.put("/:id",upload("public/worker/").single("image"),workerController.update);
router.get("/:id",workerController.getbyId);

module.exports = router;