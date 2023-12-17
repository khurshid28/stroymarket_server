


const mongoose = require("mongoose");

const testschema = mongoose.Schema({
    name: String,
    id: Number,
    isUsed: {
        type: Boolean,
        default: true
    },
},{strict:false})

const test = mongoose.model("test", test);

module.exports = test;