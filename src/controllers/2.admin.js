const adminModel = require("../models/2.admin");
const orderModel = require("../models/14.order");
const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  AuthorizationError,
} = require("../utils/errors");
const shopModel = require("../models/5.shop");

class AdminController {
  async create(req, res, next) {
    try {
      let { fullname, phone, shop_id, chat_id } = req.body;
      let login = cryptoRandomString({ length: 10 });
      let password = cryptoRandomString({ length: 15 });
      let admin = await adminModel.create({
        fullname,
        phone,
        shop_id,
        chat_id,
        login,
        password,
      });

      return res.status(201).json({
        message: "success",
        data: admin,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value = await adminModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "admin is deleted",
        });
      } else {
        return next(new BadRequestError(400, "Not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async all(req, res, next) {
    try {
      let all = await adminModel.find({});
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
      let admin = await adminModel.findById(id);
      if (admin) {
        return res.status(200).json({
          message: "success",
          data: admin,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async profile(req, res, next) {
    try {
      console.log(req.user);
      if (req.user.role != "Admin") {
        return next(new AuthorizationError(401, "No Access"));
      }
      let data = await orderModel.aggregate([
        { $match: { shop_id: req.user.shop_id } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalProduct: { $sum: { $sum: "$products.count" } },
            orders_count: {
              $sum: 1,
            },
            yandexTotal: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      { $eq: ["$delivery_type", "yandex"] },
                      { $eq: ["$receive_type", "delivery"] },
                    ],
                  },
                  then: { $sum: "$amount" },
                  else: 0,
                },
              },
            },
            marketTotal: {
              $sum: {
                $cond: {
                  if: { $eq: ["$receive_type", "market"] },
                  then: { $sum: "$amount" },
                  else: 0,
                },
              },
            },
            fixedTotal: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      { $eq: ["$delivery_type", "fixed"] },
                      { $eq: ["$receive_type", "delivery"] },
                    ],
                  },
                  then: { $sum: "$amount" },
                  else: 0,
                },
              },
            },
          },
        },
      ]);

      let shop = await shopModel.findOne({
        _id: req.user.shop_id,
      });

      if (data) {
        return res.status(200).json({
          message: "success",
          data: {
            order: data[0],
            product: {
              products_total: shop.products.length,
            },
          },
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new AdminController();
