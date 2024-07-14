const mongoose = require("mongoose");
let ShopProductschema = mongoose.Schema(
  {
    shop_id : String,
    product_id : String,
    count :{
        type :Number,
        default :0
    },
    name: String,
    price : Number,
    status  : {
        type : String,
        default : "working" // "deleted"
    }
  },
  { strict: false, timestamps: true }
);
let shopProduct = mongoose.model("shopProduct", ShopProductschema);

module.exports = shopProduct;
