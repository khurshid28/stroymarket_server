const orderModel = require("../models/14.order");
const userModel = require("../models/1.user");
const adminModel = require("../models/2.admin");
const productModel = require("../models/7.product");
let mongoose = require("mongoose");
let shopProductModel = require("../models/16.shopProduct");
const { ObjectId } = require("mongodb");
const axios = require("axios");
let bot = require("../bot/support");
let toMoney = require("../utils/toMoney");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");
const shopModel = require("../models/5.shop");
const { addListener } = require("../models/2.admin");

class OrderController {
  async create(req, res, next) {
    try {
      let { shop_id, delivery_type, amount, products, location } = req.body;
      let order = await orderModel.create({
        user_id: req.user._id,
        shop_id,
        delivery_type,
        amount,
        products,
        location,
      });
      let shop = await shopModel.findOne({ _id: shop_id });
      

      let admin = await adminModel.findOne({
        shop_id,
      });
      console.log(">>>>");
      console.log(admin);
      if (admin.chat_id) {
        // let user = await userModel.findOne({
        //   _id: req.user.id,
        // });
        // console.log(">>>>>", user);
        let text =
        "<b>ORDER-" +
        `${order.order_id ?? ""}` +
        "\n\n" +
          "TEL: " +
          `+${req.user.phone ?? ""}` +
          "\n\n" +
          "SUMMA: " +
          `${toMoney(Math.floor(amount))} UZS` +
          "\n\n" +
          "XIZMAT TURI: " +
          (delivery_type != "market" ? (delivery_type != "yandex" ? "STANDART": "YANDEX" ): "DO'KONDAN OLIB KETISH") +
        
          "\n\n" +
          "TOVARLAR:" +
          "\n" +
          products.map((p) => p.product_name +","+  p.name + " "+ p.count+"ta [ " + toMoney(p.price)+" so'm ]").join("\n")
           +
          "</b>";
        if(delivery_type !="market"){
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
        }else{
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
        }
        

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
        _id: id,
      });
      if (!oldOrder) {
        return next(new NotFoundError(404, "Not found"));
      }
      if (oldOrder.status != "started") {
        return next(new BadRequestError(400, "This order is already finished"));
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
      await order.products.forEach(async p => {
        let shopProductOne = await shopProductModel.findOne({
          _id : p["id"]
        },);
  
        await shopProductModel.updateOne({
          _id : p["id"]
        },{
          count : shopProductOne.count -  p.count
        });
        let ProductOne = await productModel.findOne({
          _id : p["product_id"]
        },);
  
        await productModel.updateOne({
          _id : p["product_id"]
        },{
          count : ProductOne.count +  p.count
        });
      });

      let newOrder = await orderModel.findOne({
        _id: id,
      });

      let user = await orderModel.findOne({
        _id: req.user._id,
      });
      let resToken = await axios.post(
        process.env.SMS_LOGIN_URL,
        {
          email: process.env.SMS_EMAIL,
          password: process.env.SMS_PASSWORD,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let resSendSms = await axios.post(
        process.env.SMS_SEND_URL,
        {
          message: `Stroymarket: Sizning buyurtmangiz qabul qilindi !!! Buyurtma raqami : ${order.order_id}`,
          from: "4546",
          mobile_phone: user.phone,
          callback_url: process.env.SMS_CALLBACK_URL,
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + resToken.data["data"]["token"],
          },
        }
      );
      
      return res.status(200).json({
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
      let all = [];
      console.log("kkk ===");
      console.log(req.user);
      if (req.user.role == "Super") {
        all = await orderModel.find({});
      } else if (req.user.role == "Admin") {
        let admin = adminModel.findOne({ _id: req.user._id });
        all = await orderModel.find({ shop_id: admin.shop_id });
      } else if (req.user.role == "User") {
        all = await orderModel.find({ user_id: req.user._id });
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
      let order = await orderModel.aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },

        { $addFields: { us_id: { $toObjectId: "$user_id" } } },
        {
          $lookup: {
            from: "users",
            localField: "us_id",
            foreignField: "_id",
            as: "user_detail",
          },
        },
      ]);

      console.log("?????");
      console.log(order[0].products);

      if (order && order.length > 0) {
        let data = order[0];
        // let shop = await shopModel.findOne({ _id: data.shop_id });
        // // console.log("> shop",shop);
        // let products = [];
        // let i = 0;
        // for await (let d of data.products) {
        //   let pId = d.product_id;
        //   let p = await productModel.findOne({ _id: pId });
          
        //   p.count = data.products[i].count;

        //   let filteredArray = shop.products.filter(function (e1) {
        //     return e1._id == pId;
        //   });

        //   if (filteredArray.length > 0) {
        //     let element = filteredArray[0];
        //     console.log(element);
        //     let filteredArray2 = element.items.filter(function (e2) {
        //       return e2._id == data.products[i].item_id;
        //     });
        //     // console.log(filteredArray2);
        //     if (filteredArray2.length > 0) {
        //       let item = filteredArray2[0];
        //       p = {
        //         ...p,
        //         item,
        //       };

        //       // console.log("p.item --",p);
        //     }
        //   }
        //   p.item_id = data.products[i].item_id;
        //   p._id = pId;
        //   products.push({
        //     ...p._doc,
        //     item: p.item,
        //     item_id: p.item_id,
        //   });
        //   i++;
        // }
        // data.products = products;
        // console.log(products);
        return res.status(200).json({
          message: "success",
          data: data,
        });
      }
      return next(new NotFoundError(404, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyShopId(req, res, next) {
    try {
      let { shop_id } = req.query;

      let order = await orderModel.aggregate([
        {
          $match: { shop_id: shop_id },
        },
        {
          $sort: { _id: -1 },
        },
        { $addFields: { us_id: { $toObjectId: "$user_id" } } },
        {
          $lookup: {
            from: "users",
            localField: "us_id",
            foreignField: "_id",
            as: "user_detail",
          },
        },
      ]);

      // console.log(">>>>>>>>>>");
      // console.log(order[1]);

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
