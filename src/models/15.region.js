const mongoose = require("mongoose");
const Regionschema = mongoose.Schema(
  {
    name: String,
  },
  { strict: false, timestamps: true }
);

const region = mongoose.model("region", Regionschema);

module.exports = region;
