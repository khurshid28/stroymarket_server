const orderModel = require("../models/14.order");
const userModel = require("../models/1.user");
const adminModel = require("../models/2.admin");
const productModel = require("../models/7.product");
const axios = require("axios");
let bot = require("../bot/support");
let toMoney = require("../utils/toMoney");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class OrderController {
  async create(req, res, next) {
    try {
      let { shop_id, receive_type, delivery_type, amount, products, location } =
        req.body;
      let order = await orderModel.create({
        user_id: req.user.id,
        shop_id,
        receive_type,
        delivery_type,
        amount,
        products,
        location,
      });
      let admin = await adminModel.findOne({
        shop_id,
      });
      if (admin.chat_id) {
        let user = await userModel.findOne({
          _id: req.user.id,
        });
        console.log(">>>>>", user);
        let text =
          "<b>TEL: " +
          `+${user.phone}` +
          "\n\n" +
          "SUMMA: " +
          `${toMoney(Math.floor(amount))} UZS` +
          "\n\n" +
          "XIZMAT TURI: " +
          (receive_type == "delivery" ? "YETQAZISH" : "OLIB KETISH") +
          ((delivery_type &&
            "\n\n" +
              "YETQAZISH TURI: " +
              (delivery_type == "yandex" ? "YANDEX" : "ODDIY DOSTAVKA")) ??
            "") +
          "\n\n" +
          "TOVARLAR:" +
          "\n" +
          products
            .map(
              (item) =>
                `${item.name} ${item.count}ta ${item.color.name} (${toMoney(
                  Math.floor(item.price)
                )} * ${item.count})`
            )
            .join("\n") +
          "</b>";

        bot
          .sendLocation(admin.chat_id, location.lat, location.lon, {})
          .then((v) => {
            bot.sendMessage(admin.chat_id, text, {
              parse_mode: "HTML",
              reply_markup: {
                remove_keyboard: true,
                inline_keyboard: [
                  [
                    {
                      text: "Yubordim",
                      callback_data: "yuborish-" + order._id,
                    },
                  ],
                ],
              },
            });
          });

        products.forEach(async (p) => {
          await productModel.findById(p.product_id).then(async (product) => {
            console.log(">>>\n" + product);
            await productModel.updateOne(
              {
                _id: product._id,
              },
              {
                count: product.count + p.count,
              }
            );
          });
        });

        
      }
      return res.status(201).json({
        message: "success",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async finish(req, res, next) {
    try {
      let { id } = req.params;

      let order = await orderModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          status: "finished",
        }
      );

      return res.status(201).json({
        message: "success",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async confirm(req, res, next) {
    try {
      let { title, subtitle } = req.body;
      let { id } = req.params;

      let order = await orderModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          status: "confirmed",
        }
      );

      return res.status(201).json({
        message: "success",
        data: order,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value = await orderModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "order is deleted",
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
      let all = await orderModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async getbyId(req, res, next) {
    try {
      let { id } = req.params;
      let order = await orderModel.findById(id);
      if (order) {
        return res.status(200).json({
          message: "success",
          data: order,
        });
      }
      return next(new NotFoundError(404, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new OrderController();
