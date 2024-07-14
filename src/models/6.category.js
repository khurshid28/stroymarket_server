const mongoose = require("mongoose");
const Categoryschema = mongoose.Schema(
  {
    id: Number,
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
