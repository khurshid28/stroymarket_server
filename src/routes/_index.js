const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");

const router = Router();
const shopRouter = require("./shop");
const phoneRouter = require("./phone");

router.use("/shop",shopRouter);
router.use("/phone",phoneRouter);


const swaggerDoc = require("../docs/swagger.js");
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
