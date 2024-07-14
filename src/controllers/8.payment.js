const paymentModel = require("../models/8.payment");
const adModel = require("../models/12.ads");
const workerModel = require("../models/10.worker");
const shopModel = require("../models/5.shop");
const adminModel = require("../models/2.admin");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");
const oneMonthFromNow = require("../utils/oneMonthfromNow");
const admin = require("../models/2.admin");
const { VirtualType } = require("mongoose");

class PaymentController {
  async adminAndShop(req, res, next) {
    try {
      let { month, shop_id, amount } = req.body;
      var paymentData ={
        type: "shop",
        shop_id,
        amount,
        // start_date
        
      }
      let shopOne = await shopModel.findOne({
        _id: shop_id,
      });
      if (!shopOne) {
        return next(new NotFoundError(404));
      }
      console.log(shopOne);
      shopOne.expired ??= new Date();
      paymentData.start_date =JSON.parse(JSON.stringify(shopOne.expired));
      let newExpired = oneMonthFromNow(shopOne.expired, month)
      paymentData.end_date = newExpired;
      let v1 = await shopModel.updateOne(
        {
          _id: shop_id,
        },
        {
          expired: newExpired,
        }
      );

      let v2 = await adminModel.updateOne(
        {
          shop_id: shop_id,
        },
        {
          expired: newExpired,
        }
      );

      let updatedShop = await shopModel.findOne({
        _id: shop_id,
      });
      let updatedAdmin = await adminModel.findOne({
        shop_id: shop_id,
      });

      
      let payment = await paymentModel.create(paymentData);
      return res.status(201).json({
        message: "success",
        data: payment,
        updatedShop,
        updatedAdmin,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async worker(req, res, next) {
    try {
      let { month, worker_id, amount } = req.body;

      let workerOne = await workerModel.findOne({
        _id: worker_id,
      });
      if (!workerOne) {
        return next(new NotFoundError(404));
      }
      console.log(workerOne);
      workerOne.expired ??= new Date();
      let v = await workerModel.updateOne(
        {
          _id: worker_id,
        },
        {
          expired: oneMonthFromNow(workerOne.expired, month),
        }
      );
      let updatedExpiredData = await workerModel.findOne({
        _id: worker_id,
      });
      let payment = await paymentModel.create({
        type: "worker",
        worker_id,
        amount,
      });

      return res.status(201).json({
        message: "success",
        data: payment,
        updatedExpiredData,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async ads(req, res, next) {
    try {
      let { month, ad_id, amount } = req.body;

      let adOne = await adModel.findOne({
        _id: ad_id,
      });
      if (!adOne) {
        return next(new NotFoundError(404));
      }
      console.log(adOne);
      adOne.expired ??= new Date();
      let v = await adModel.updateOne(
        {
          _id: ad_id,
        },
        {
          expired: oneMonthFromNow(adOne.expired, month),
        }
      );
      let updatedExpiredData = await adModel.findOne({
        _id: ad_id,
      });
      let payment = await paymentModel.create({
        type: "ad",
        ad_id,
        amount,
      });

      return res.status(201).json({
        message: "success",
        data: payment,
        updatedExpiredData,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  
  async all(req, res, next) {
    try {
      let all = await paymentModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new PaymentController();
