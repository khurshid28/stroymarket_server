const shopModel = require("../models/5.shop");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class ShopController {
  async all(req, res, next) {
    try {
      let all = await shopModel.find({});
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
      } = req.body;
      console.log(filename);
      let shop = await shopModel.create({
        name,
        desc,
        image: filename ? "/static/shop/" + filename : null,
        region_id,
        address,
        location,
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
      let { product_id, name, price,count } = req.body;
      let { id } = req.params;
      let shop = await shopModel.findOne({ _id: id });
      let index = shop.products.findIndex(x => x._id === product_id);
      if (index> -1) {
        shop.products[index].items.push({name, price,count });
      }else{
        shop.products.push({
          _id: product_id,
          items:[
            {  name, price,count }
          ]
        })
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
