


const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const testschema = mongoose.Schema({
    id: Number,
    name: String,
    id: Number,
    isUsed: {
        type: Boolean,
        default: true
    },
},{strict:false})

test.plugin(AutoIncrement, {inc_field: 'id'});
const test = mongoose.model("test", testschema);

module.exports = test;