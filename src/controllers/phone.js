const axios = require("axios");
let { InternalServerError,BadRequestError } = require("../utils/errors");
let phoneModel = require("../models/phone");
const userModel = require("../models/1.user");
const jwt = require("../utils/jwt.js");

class PhoneController {
  async phone(req, res, next) {
    try {
      let { phone } = req.body;

      let resToken = await axios.post(
        process.env.SMS_LOGIN_URL,
        {
          email: process.env.SMS_EMAIL,
          password: process.env.SMS_PASSWORD,
        },

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let code = require("../utils/sms_generate")();
      await phoneModel.deleteMany({ num: phone });
      await phoneModel.create({ num: phone, code: code });
      // await phoneModel.save();
      let resSendSms = await axios.post(
        process.env.SMS_SEND_URL,
        {
          message: `Stroymarket: Your confirmation code for registration is: ${code}`,
          from: "4546",
          mobile_phone: phone,
          callback_url: process.env.SMS_CALLBACK_URL,
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + resToken.data["data"]["token"],
          },
        }
      );
      if (resSendSms.status == 200) {
     
  
        return res.status(200).json({
          message: "Sent sms successfully",
          
        });
      } else {
    
       return next(new BadRequestError(400, "Not sent sms"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async verify(req, res, next) {
    try {
      
      let { phone, code } = req.body;
      let phoneOne = await phoneModel.findOne({
        num: phone,
        code,
        date: { $gte: Date.now() - 1000 * 60 * 2 },
      });
      if (phoneOne) {
        await phoneModel.deleteMany({
          num: phone,
          code
        });
        let userOne = await userModel.findOne({phone})
        if (!userOne) {
          userOne = await userModel.create({phone})
        }
        const token = jwt.sign({
          id: userOne._id,
          agent: req.headers["user-agent"],
          role: "User",
        });
        console.log(phoneOne);
       

        return res.status(200).json({
          message: "success",
          token
        });
      } else {
        return next(new BadRequestError(400, "Invalid sms code"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

}

module.exports = new PhoneController();
