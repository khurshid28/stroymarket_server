const mongoose = require("mongoose");
const userschema = mongoose.Schema({
    phone:  String,
    role: {
        type: String,
        default: "User"
    }
   
},{strict:false})


const user = mongoose.model("user", userschema);

module.exports = user;