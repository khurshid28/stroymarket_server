let shopProductModel = require("../models/16.shopProduct");


let ProductModel = require("../models/7.product");

const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class shopProductController {
  async create(req, res, next) {
    try {
      let { name, price, product_id, count, shop_id } = req.body;

      let shopProduct = await shopProductModel.create({
        name,
        price,
        product_id,
        shop_id,
        count,
      });

      return res.status(201).json({
        message: "success",
        data: shopProduct,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value = await shopProductModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "region is deleted",
        });
      } else {
        return next(new NotFoundError(404, "Not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async all(req, res, next) {
    try {
      let all = await shopProductModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async get(req, res, next) {
    try {
      let { id } = req.params;
      let shopProduct = await shopProductModel.findById(id);
      if (shopProduct) {
        return res.status(200).json({
          message: "success",
          data: shopProduct,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async getAllinProduct(req, res, next) {
    try {
      let { product_id,shop_id } = req.query;
      let shopProductAll = await shopProductModel.find({
        product_id,
        shop_id
      });
      let shopProducts = await shopProductModel.find({ shop_id });
     

      let arrData = shopProducts.map( function getData(item){
        return item.product_id;
      });
      arrData = Array.from(new Set(arrData));
      console.log(arrData);
      let products = await ProductModel.find({
        _id: { $in: arrData },
      });

      if (shopProducts) {
        return res.status(200).json({
          message: "success",
          data: shopProductAll,
          tavsiyalar :  products
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  
  
}

module.exports = new shopProductController();
