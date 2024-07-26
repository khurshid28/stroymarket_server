const mongoose = require("mongoose");
const Serviceschema = mongoose.Schema(
  {
    id: Number,
    name_uz: String,
    name_ru: String,
    name_en: String,
    image: String,
    work_status: {
      type: String,
      default: "working",
    },
    desc: String,
    
  },
  { strict: false,timestamps: true }
);
const service = mongoose.model("service", Serviceschema);

module.exports = service;
