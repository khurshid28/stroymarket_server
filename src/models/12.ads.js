const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const oneMonthFromNow = require("../utils/oneMonthfromNow");
const Adsschema = mongoose.Schema(
  {
    id: Number, 
    image: String,
    title: String,
    subtitle: String,
    expired: {
      type:Date,
      default: oneMonthFromNow(new Date(),1)
    }
    
  },
  { strict: false,timestamps: true }
);
const ads = mongoose.model("ads", Adsschema);

module.exports = ads;
