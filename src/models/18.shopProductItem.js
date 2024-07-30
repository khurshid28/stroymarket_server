const mongoose = require("mongoose");
const ShopproductItemschema = mongoose.Schema(
  {
    shop_id :String,
    product_id : String,
    item_id : String,
    price :String,
   
  },
  { strict: false, timestamps: true }
);
const shopproductItem = mongoose.model("shop-productitem", ShopproductItemschema);

module.exports = shopproductItem;
