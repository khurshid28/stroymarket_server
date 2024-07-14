const mongoose = require("mongoose");
const Newsschema = mongoose.Schema(
  {
    id: Number,
    image: String,
    title: String,
    subtitle: String,
    
  },
  { strict: false,timestamps: true }
);
const news = mongoose.model("news", Newsschema);

module.exports = news;
