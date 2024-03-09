const mongoose = require("mongoose");
const superschema = mongoose.Schema(
  {
    fullname: String,
    phone: String,
    work_status: {
      type: String,
      default: "working",
    },
    login: String,
    password: String,
    role: {
      type: String,
      default: "Super",
    },
  },
  { strict: false,timestamps: true }
);

const superModel = mongoose.model("super", superschema);

module.exports= superModel;
