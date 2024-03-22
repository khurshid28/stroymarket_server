const mongoose = require("mongoose");
const userschema = mongoose.Schema({
    phone:  String,
    role: {
        type: String,
        default: "User"
    },
    work_status: {
        type: String,
        default: "working", // working,blocked
      },
   
},{strict:false})


const user = mongoose.model("user", userschema);

module.exports = user;