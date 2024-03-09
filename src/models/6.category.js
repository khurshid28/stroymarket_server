const mongoose = require("mongoose");
const Categoryschema = mongoose.Schema(
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

const category = mongoose.model("category", Categoryschema);

module.exports = category;
