const mongoose = require("mongoose");
const paymentschema = mongoose.Schema(
  {
    id: Number,
    type :String, // "shop","worker","ad"
    shop_id: String,
    worker_id:String,
    ad_id:String,
    amount: Number,
    month: Number,
    start_date : Date,
    end_date : Date,


  },
  { strict: false,timestamps: true }
);
const payment = mongoose.model("payment", paymentschema);

module.exports = payment;
