const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Orderschema = mongoose.Schema(
  {
    order_id: Number,
    user_id: String,
    shop_id: String,
    status: {
      type: String,
      default: "started",
    }, 
    //  "started","finished","canceled","confirmed"
    
    receive_type: String,   //  market,delivery
    delivery_type: String,  // yandex,fixed
    location: {
      lat: Number,
      lon: Number,
    },
    amount: Number,
    products: [
      {
        id: String,
        name : String,
        product_name : String,
        image : String,
        shop_id: String,
        product_id :String,
        price: Number,
        count: Number
      },
    ],
  },

  { strict: false, timestamps: true }
);
Orderschema.plugin(AutoIncrement, {inc_field: 'order_id'});
const order = mongoose.model("order", Orderschema);

module.exports = order;
