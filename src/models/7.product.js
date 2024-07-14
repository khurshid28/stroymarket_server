const mongoose = require("mongoose");
const Productschema = mongoose.Schema(
  {
    id: Number,
    name: String,
    image: String,
    category_id: String,
    type: String, // null,color,weight,length,size
    count : {
      type:Number,
      default :0
    },
    work_status: {
      type: String,
      default: "working",
    },
    desc: String,
  },
  { strict: false,timestamps: true }
);
const product = mongoose.model("product", Productschema);

module.exports = product;
