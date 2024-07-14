const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const superschema = mongoose.Schema(
  {
    id: Number,
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
