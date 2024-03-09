const mongoose = require("mongoose");
const oneMonthFromNow = require("../utils/oneMonthfromNow");
const workerschema = mongoose.Schema(
  {
    fullname: String,
    phone: String,
    service_id: String,

    work_status: {
      type: String,
      default: "working",
    },
    login: String,
    password: String,
    desc: String,
    image: String,
    amount: Number,
    payment_type: String, //     null,once,hour,day,month
    role: {
      type: String,
      default: "Worker",
    },
    expired: {
      type:Date,
      default: oneMonthFromNow(new Date(),1)
    }
  },
  { strict: false,timestamps: true }
);

const worker = mongoose.model("worker", workerschema);

module.exports = worker;
