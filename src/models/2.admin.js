const mongoose = require("mongoose");
const oneMonthFromNow = require("../utils/oneMonthfromNow");
const adminschema = mongoose.Schema(
  {
    fullname: String,
    phone: String,
    shop_id: String,
    chat_id :String,
    work_status: {
      type: String,
      default: "working",
    },
    login: String,
    password: String,
    role: {
      type: String,
      default: "Admin",
    },
    expired: {
      type:Date,
      default: oneMonthFromNow(new Date(),1)
    }
  },
  { strict: false,timestamps: true }
);

const admin = mongoose.model("admin", adminschema);

module.exports= admin;
