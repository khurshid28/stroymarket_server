const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Regionschema = mongoose.Schema(
  {
    id: Number,
    name: String,
  },
  { strict: false, timestamps: true }
);
const region = mongoose.model("region", Regionschema);

module.exports = region;
