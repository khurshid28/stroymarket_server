const mongoose = require("mongoose");

const oneMonthFromNow = require("../utils/oneMonthfromNow");
const shopschema = mongoose.Schema(
  {
    
    types : [
      {
        name: String,
        value : String,
      },
    ],
    name: String,
    work_status: {
      type: String,
      default: "working", // working,blocked
    },
    region_id: String,
    address: String,
    location: {
      lat: Number,
      lon: Number,
    },

    // delivery_type: String,
    // null,yandex,fixed
    delivery_amount: Number,
    
    

    image: String,
    expired: {
      type: Date,
      default: oneMonthFromNow(new Date(), 1),
    },
    categories: [
      {
        _id: String,
      },
    ],
    products: [
      {
        _id: String,
        items: [
          {
            name: String,
            price: Number,
            isDeleted : {
              type: Boolean,
              default : false
            },
            count: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { strict: false, timestamps: true }
);
const shopModel = mongoose.model("shop", shopschema);

module.exports = shopModel;
