const mongoose = require("mongoose");
const Orderschema = mongoose.Schema(
  {
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
        product_id: String,
        name : String,
        category_id: String,
        price: Number,
        count: Number,
        color: {
          name :String,
          hash: String
        },

      },
    ],
  },
  { strict: false, timestamps: true }
);

const order = mongoose.model("order", Orderschema);

module.exports = order;
