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
let shopProductRouter = require("./16.shopProduct");


const newsRouter = require("./13.news");
const adsRouter = require("./12.ads");


const paymentRouter = require("./8.payment");
const regionRouter = require("./15.region");
const orderRouter = require("./14.order");



router.use("/phone",phoneRouter);
router.use("/login",loginRouter);
router.use("/admin",checkToken,adminRouter);
router.use("/super",superRouter);
router.use("/shop",checkToken,shopRouter);
router.use("/service",checkToken,serviceRouter);
router.use("/worker",checkToken,workerRouter);

router.use("/category",categoryRouter);
router.use("/product",checkToken,productRouter);
router.use("/shop-product",shopProductRouter);


router.use("/news",checkToken,newsRouter);
router.use("/ads",checkToken,adsRouter);

router.use("/payment",checkToken,paymentRouter);
router.use("/region",checkToken,regionRouter);

router.use("/order",checkToken,orderRouter);

const swaggerDoc = require("../docs/swagger.js");
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
