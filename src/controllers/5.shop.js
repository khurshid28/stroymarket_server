const shopModel = require("../models/5.shop");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class ShopController {
  async all(req, res, next) {
    try {
      let all = await shopModel.find({})
      return res.status(200).json({
        message: "success",
        data:all
       
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
}

module.exports = new ShopController();
