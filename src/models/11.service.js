const mongoose = require("mongoose");
const Serviceschema = mongoose.Schema(
  {
    name: String,
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
