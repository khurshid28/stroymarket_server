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
const shopModel = require("../models/5.shop");

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
      let shop = await shopModel.findOne({ _id: shop_id });
      let productNames = await Promise.all(
        products.map(async (item) => {
          let prod = await productModel.findById(item.product_id);

          let index = shop.products.findIndex((x) => x._id == item.product_id);
          let kindex = shop.products[index].items.findIndex(
            (x) => x._id == item.item_id
          );
          let ItemVal = shop.products[index].items[kindex];
          return `${prod.name} ${item.count}ta ${ItemVal.name} (${toMoney(
            Math.floor(ItemVal.price)
          )} * ${item.count})`;
        })
      );

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
          productNames.join("\n") +
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
            // shop.products[index]
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
      let oldOrder = await orderModel.findOne({
        _id:id,
      });
      if (oldOrder.status != "started") {
        return next(new BadRequestError(400,"⚠️ This order is already finished"))
      }

      let order = await orderModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          status: "finished",
        }
      );
      let shop = await shopModel.findOne({ _id: order.shop_id });
      order.products.map(async(item) => {
        console.log(item);
        let index = shop.products.findIndex((x) => x._id == item.product_id);
        console.log(index);
        let kindex = shop.products[index].items.findIndex((x) => x._id == item.item_id);
        console.log(kindex);
        shop.products[index].items[kindex].count -= item.count
        await shopModel.updateOne({ _id: order.shop_id},{
          products: shop.products
        })

      });
      let newOrder = await orderModel.findOne({
        _id: id,
      });

      return res.status(201).json({
        message: "success",
        data: newOrder,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async cancel(req, res, next) {
    try {
      let { title, subtitle } = req.body;
      let { id } = req.params;

      let order = await orderModel.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          status: "canceled",
        }
      );
      let newOrder = await orderModel.findOne({
        _id: id,
      });

      return res.status(200).json({
        message: "success",
        data: newOrder,
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
      let newOrder = await orderModel.findOne({
        _id: id,
      });

      return res.status(200).json({
        message: "success",
        data: newOrder,
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

      let all =[]
      console.log("kkk ===");
      console.log(req.user);
      if(req.user.role == "Super"){
       all  = await orderModel.find({});
      }
      else if (req.user.role == "Admin") {
        let admin = adminModel.findOne({_id:req.user._id})
        all = await orderModel.find({shop_id:admin.shop_id});
      }
      else if (req.user.role == "User") {
        all = await orderModel.find({user_id: req.user._id});
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
