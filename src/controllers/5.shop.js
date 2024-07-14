const shopModel = require("../models/5.shop");

let adminModel = require("../models/2.admin");
let shopProductModel = require("../models/16.shopProduct");
let productModel = require("../models/7.product");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class ShopController {
  async all(req, res, next) {
    try {
      let { regions } = req.query;
      console.log(regions);
      let all;
      if (regions) {
        all = await shopModel.find({
          region_id: { $in: `${regions}`.split(",") },
        });
      } else {
        all = await shopModel.find({});
      }

      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async create(req, res, next) {
    try {
      let {
        name,
        desc,
        filename,
        region_id,
        address,
        location,
        delivery_type,
        delivery_amount,
        types,
      } = req.body;
      console.log(filename);
      let shop = await shopModel.create({
        name,
        desc,
        image: filename ? "/static/shop/" + filename : null,
        region_id,
        address,
        location: location,
        types: types ??  [
          { name: "YANDEX", value: "true" },
          { name: "FIXED", value: "true" },
          { name: "MARKET", value: "true" },
        ],
        delivery_type,
        delivery_amount,
      });

      return res.status(201).json({
        message: "success",
        data: shop,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async addProduct(req, res, next) {
    try {
      let { product_id, name, price, count } = req.body;
      let { id } = req.params;
      let shop = await shopModel.findOne({ _id: id });
      let index = shop.products.findIndex((x) => x._id === product_id);
      if (index > -1) {
        shop.products[index].items.push({ name, price, count });
      } else {
        shop.products.push({
          _id: product_id,
          items: [{ name, price, count }],
        });
      }
      console.log(shop.products);

      // shop.products.push({ _id: product_id, name, price,count });
      await shopModel.updateOne(
        { _id: id },
        {
          products: shop.products,
        }
      );
      let shopNew = await shopModel.findOne({ _id: id });
      return res.status(200).json({
        message: "success",
        data: shopNew,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getById(req, res, next) {
    try {
      let { id } = req.params;
      let shop = await shopModel.findOne({ _id: id });
      let admin = await adminModel.findOne({ shop_id: id });
      let shopProducts = await shopProductModel.find({ shop_id: id });

      let arrData = shopProducts.map(function getData(item) {
        return item.product_id;
      });
      arrData = Array.from(new Set(arrData));
      console.log(arrData);
      let products = await productModel.find({
        _id: { $in: arrData },
      });

      console.log(">>"+admin);

      console.log({
        message: "success",
        data: shop,
        admin:  admin && {
          fullname: admin["fullname"],
          phone: admin["phone"],
        },
        products,
      });
      return res.status(200).json({
        message: "success",
        data: shop,
        admin: admin && {
          fullname: admin["fullname"],
          phone: admin["phone"],
        },
        products,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getByProductId(req, res, next) {
    try {
      let { product_id, regions } = req.query;

      console.log({ product_id, regions });
      let shopProducts = await shopProductModel.find({ product_id });

      let arrData = shopProducts.map(function getData(item) {
        return item.shop_id;
      });
      arrData = Array.from(new Set(arrData));
      console.log(arrData);

      let shops;
      if (regions) {
        shops = await shopModel.find({
          _id: { $in: arrData },
          region_id: { $in: `${regions}`.split(",") },
        });
      } else {
        shops = await shopModel.find({
          _id: { $in: arrData },
        });
      }

      console.log(">>");

      console.log({
        message: "success",
        data: shops,
      });
      return res.status(200).json({
        message: "success",
        data: shops,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async changeTypes(req, res, next) {
    try {
      let { id } = req.params;
      let { types } = req.body;
      let shop = await shopModel.findOneAndUpdate(
        { _id: id },
        {
          types,
        }
      );

      return res.status(200).json({
        message: "success",
        data: shop,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new ShopController();
