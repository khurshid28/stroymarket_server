const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const checkToken =require("../middlewares/check-token")

const router = Router();
const shopRouter = require("./5.shop");
const phoneRouter = require("./phone");
const loginRouter = require("./login");
const adminRouter = require("./2.admin");
const superRouter = require("./4.super");
const serviceRouter = require("./11.service");
const workerRouter = require("./10.worker");
const categoryRouter = require("./6.category");
const productRouter = require("./7.product");

const newsRouter = require("./13.news");
const adsRouter = require("./12.ads");


const paymentRouter = require("./8.payment");
const regionRouter = require("./15.region");
const orderRouter = require("./14.order");



router.use("/phone",phoneRouter);
router.use("/login",loginRouter);
router.use("/admin",adminRouter);
router.use("/super",superRouter);
router.use("/shop",shopRouter);
router.use("/service",serviceRouter);
router.use("/worker",workerRouter);

router.use("/category",categoryRouter);
router.use("/product",productRouter);


router.use("/news",newsRouter);
router.use("/ads",adsRouter);

router.use("/payment",paymentRouter);
router.use("/region",regionRouter);

router.use("/order",orderRouter);

const swaggerDoc = require("../docs/swagger.js");
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
