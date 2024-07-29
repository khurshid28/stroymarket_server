const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const productItemschema = mongoose.Schema(
  {
    product_id : String,
    name: String,
    image :String,
  },
  { strict: false, timestamps: true }
);
const productItem = mongoose.model("productitem", productItemschema);

module.exports = productItem;
