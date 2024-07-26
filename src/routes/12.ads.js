

const { Router } = require("express");

const router = Router();

let adsController = require("../controllers/12.ads");
const upload = require("../utils/upload");

router.post("/create",upload("public/ads/").single("image"),adsController.create);
router.get("/all",adsController.all);
router.delete("/delete/:id",adsController.delete);
router.put("/:id",upload("public/ads/").single("image"),adsController.update);

module.exports = router;