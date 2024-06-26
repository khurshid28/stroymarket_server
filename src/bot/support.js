const TelegramBot = require("node-telegram-bot-api");
let toMoney = require("../utils/toMoney");
const bot = new TelegramBot(process.env.SUPPORT_BOT_TOKEN, { polling: true });
let admin = 536509231;
let orderModel = require("../models/14.order");
let adminModel = require("../models/2.admin");

let shopModel = require("../models/5.shop");
let paymentModel = require("../models/8.payment");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text == "/start") {
    bot.sendMessage(chatId, "✋ Welcome to Stroymarket support bot");
  } else if (msg.text == "/id") {
    bot.sendMessage(chatId, msg.chat.id);
  } else if (chatId == admin || chatId == 2053690211) {
    if (msg.text == "/today") {
      // let order =await  orderModel.find({}).sort({"createdAt":-1})
      let order = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(new Date() + 5 * 1000 * 60 * 60).setHours(00, 00, 00) -
                  1000 * 86400
              ),
            },
          },
        },
        {
          $group: {
            // _id: "$_id",
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            // createdAt :{
            //   "$first":"$createdAt"
            // }
          },
        },
      ]);

      let payment = await paymentModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(new Date() + 5 * 1000 * 60 * 60).setHours(00, 00, 00) -
                  1000 * 86400
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      console.log(order);

      console.log(payment);
      console.log(
        new Date(
          new Date(new Date() + 5 * 1000 * 60 * 60) + 5 * 60 * 60 * 1000
        ).toISOString()
      ); //- 10*1000*86400

      let text =
        "<b> - - -   BUGUN   - - - \n\n" +
        "ZAKAZLAR SONI: " +
        `${toMoney(Math.floor((order[0] && order[0].count) ?? 0))}` +
        "\n\n" +
        "ZAKAZLAR: " +
        `${toMoney(Math.floor((order[0] && order[0].total) ?? 0))} UZS` +
        "\n\n" +
        "TO'LOVLAR : " +
        `${toMoney(Math.floor((payment[0] && payment[0].total) ?? 0))} UZS` +
        "\n\n" +
        "</b>";
      bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
      });
    } else if (msg.text == "/all") {
      let order = await orderModel.aggregate([
        { $unwind: "$createdAt" },
        {
          $group: {
            // _id: "$_id",
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            // createdAt :{
            //   "$first":"$createdAt"
            // }
          },
        },
        // {
        //   $sort :{
        //     "createdAt" : -1
        //   }
        // }
      ]);
      let shop = await shopModel.aggregate([
        { $unwind: "$createdAt" },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      let payment = await paymentModel.aggregate([
        { $unwind: "$createdAt" },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      console.log(order);
      console.log(shop);
      console.log(payment);

      let text =
        "<b> - - -   UMUMIY   - - - \n\nDO'KONLAR SONI: " +
        `${(shop[0] && shop[0].count) ?? 0}` +
        "\n\n" +
        "ZAKAZLAR SONI: " +
        `${toMoney(Math.floor((order[0] && order[0].count) ?? 0))}` +
        "\n\n" +
        "ZAKAZLAR: " +
        `${toMoney(Math.floor((order[0] && order[0].total) ?? 0))} UZS` +
        "\n\n" +
        "TO'LOVLAR : " +
        `${toMoney(Math.floor((payment[0] && payment[0].total) ?? 0))} UZS` +
        "\n\n" +
        "</b>";
      bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
      });
    } else if (msg.text == "/yesterday") {
      let order = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(new Date() + 5 * 1000 * 60 * 60).setHours(00, 00, 00) -
                  2 * 1000 * 86400
              ),
              $lt: new Date(
                new Date(new Date() + 5 * 1000 * 60 * 60).setHours(00, 00, 00) -
                  1000 * 86400
              ),
            },
          },
        },
        {
          $group: {
            // _id: "$_id",
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            // createdAt :{
            //   "$first":"$createdAt"
            // }
          },
        },
        // {
        //   $sort :{
        //     "createdAt" : -1
        //   }
        // }
      ]);

      let payment = await paymentModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date(new Date() + 5 * 1000 * 60 * 60).setHours(00, 00, 00) -
                  2 * 1000 * 86400
              ),
              $lt: new Date(
                new Date(new Date() + 5 * 1000 * 60 * 60).setHours(00, 00, 00) -
                  1000 * 86400
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      console.log(order);
      // console.log(shop[0]);
      console.log(payment);

      let text =
        "<b> - - -   KECHA   - - - \n\n" +
        "ZAKAZLAR SONI: " +
        `${toMoney(Math.floor((order[0] && order[0].count) ?? 0))}` +
        "\n\n" +
        "ZAKAZLAR: " +
        `${toMoney(Math.floor((order[0] && order[0].total) ?? 0))} UZS` +
        "\n\n" +
        "TO'LOVLAR : " +
        `${toMoney(Math.floor((payment[0] && payment[0].total) ?? 0))} UZS` +
        "\n\n" +
        "</b>";
      bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
      });
    }
  } else {
    let admin_client = await adminModel.findOne({
      chat_id: chatId,
    });
    if (admin_client) {
      if (msg.text == "/today") {
        // let order =await  orderModel.find({}).sort({"createdAt":-1})
        let order = await orderModel.aggregate([
          {
            $match: {
              shop_id: admin_client.shop_id,
              createdAt: {
                $gte: new Date(
                  new Date(new Date() + 5 * 1000 * 60 * 60).setHours(
                    00,
                    00,
                    00
                  ) -
                    1000 * 86400
                ),
              },
            },
          },
          {
            $group: {
              // _id: "$_id",
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
              // createdAt :{
              //   "$first":"$createdAt"
              // }
            },
          },
        ]);

        console.log(order);

        console.log(
          new Date(
            new Date(new Date() + 5 * 1000 * 60 * 60) + 5 * 60 * 60 * 1000
          ).toISOString()
        ); //- 10*1000*86400

        let text =
          "<b> - - -   BUGUN   - - - \n\n" +
          "ZAKAZLAR SONI: " +
          `${toMoney(Math.floor((order[0] && order[0].count) ?? 0))}` +
          "\n\n" +
          "ZAKAZLAR: " +
          `${toMoney(Math.floor((order[0] && order[0].total) ?? 0))} UZS` +
          "\n\n" +
          "</b>";
        bot.sendMessage(chatId, text, {
          parse_mode: "HTML",
        });
      } else if (msg.text == "/all") {
        let order = await orderModel.aggregate([
          {
            $match: {
              shop_id: admin_client.shop_id,
            },
          },
          { $unwind: "$createdAt" },
          {
            $group: {
              // _id: "$_id",
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
              // createdAt :{
              //   "$first":"$createdAt"
              // }
            },
          },
          // {
          //   $sort :{
          //     "createdAt" : -1
          //   }
          // }
        ]);

        console.log(order);

        let text =
          "<b> - - -   UMUMIY   - - - \n\n" +
          "ZAKAZLAR SONI: " +
          `${toMoney(Math.floor((order[0] && order[0].count) ?? 0))}` +
          "\n\n" +
          "ZAKAZLAR: " +
          `${toMoney(Math.floor((order[0] && order[0].total) ?? 0))} UZS` +
          "\n\n" +
          "</b>";
        bot.sendMessage(chatId, text, {
          parse_mode: "HTML",
        });
      } else if (msg.text == "/yesterday") {
        let order = await orderModel.aggregate([
          {
            $match: {
             
              shop_id: admin_client.shop_id,
              createdAt: {
                $gte: new Date(
                  new Date(new Date() + 5 * 1000 * 60 * 60).setHours(
                    00,
                    00,
                    00
                  ) -
                    2 * 1000 * 86400
                ),
                $lt: new Date(
                  new Date(new Date() + 5 * 1000 * 60 * 60).setHours(
                    00,
                    00,
                    00
                  ) -
                    1000 * 86400
                ),
              },
            },
          },
          {
            $group: {
              // _id: "$_id",
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
              // createdAt :{
              //   "$first":"$createdAt"
              // }
            },
          },
          // {
          //   $sort :{
          //     "createdAt" : -1
          //   }
          // }
        ]);

        console.log(order);

        let text =
          "<b> - - -   KECHA   - - - \n\n" +
          "ZAKAZLAR SONI: " +
          `${toMoney(Math.floor((order[0] && order[0].count) ?? 0))}` +
          "\n\n" +
          "ZAKAZLAR: " +
          `${toMoney(Math.floor((order[0] && order[0].total) ?? 0))} UZS` +
          "\n\n" +
          "</b>";
        bot.sendMessage(chatId, text, {
          parse_mode: "HTML",
        });
      }
    }
  }
});
bot.on("callback_query", async (msg) => {
  console.log(msg.data);
  let data = msg.data;
  let text = data.split("-")[0];
  if (text == "yuborish") {
    let _id = data.split("-")[1];
    let oldOrder = await orderModel.findOne({
      _id,
    });
    if (oldOrder.status != "started") {
      bot
        .editMessageReplyMarkup(
          {
            reply_markup: JSON.stringify({
              keyboard: [],
            }),
          },
          {
            message_id: msg.message.message_id,
            chat_id: msg.from.id,
            inline_message_id: msg.message.message_id,
          }
        )
        .then((v) => {
          bot.sendMessage(msg.from.id, "⚠️ This order is already finished");
        });

      return;
    }

    let order = await orderModel.findByIdAndUpdate(
      {
        _id,
      },
      {
        status: "finished",
      }
    );

    let shop = await shopModel.findOne({ _id: order.shop_id });
    order.products.map(async (item) => {
      console.log(item);
      let index = shop.products.findIndex((x) => x._id == item.product_id);
      console.log(index);
      // console.log(shop.products[index]);
      let kindex = shop.products[index].items.findIndex(
        (x) => x._id == item.item_id
      );
      console.log(kindex);
      // console.log(shop.products[index].items[kindex]);
      shop.products[index].items[kindex].count -= item.count;
      await shopModel.updateOne(
        { _id: order.shop_id },
        {
          products: shop.products,
        }
      );
    });
    bot
      .editMessageReplyMarkup(
        {
          reply_markup: JSON.stringify({
            keyboard: [],
          }),
        },
        {
          message_id: msg.message.message_id,
          chat_id: msg.from.id,
          inline_message_id: msg.message.message_id,
        }
      )
      .catch((err) => {
        //some error handling
        console.log(err);
      })
      .then(function (res) {
        if (res)
          bot.editMessageText(
            msg.message.text + "\n\n" + "✅ Mijozga xabar yuborildi",
            {
              message_id: msg.message.message_id,
              chat_id: msg.from.id,
              inline_message_id: msg.message.message_id,
            }
          );
      });
  }
});

bot.on("polling_error", console.log);

module.exports = bot;
