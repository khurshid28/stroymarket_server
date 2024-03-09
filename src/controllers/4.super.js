const superModel = require("../models/4.super");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class SuperController {
  async create(req, res, next) {
    try {
      let { fullname, phone, shop_id } = req.body;
      let login = cryptoRandomString({ length: 10 });
      let password = cryptoRandomString({ length: 15 });
      let superOne = await superModel.create({
        fullname,
        phone,
       
        login,
        password
      });

      return res.status(201).json({
        message: "success",
        data: superOne,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value =await superModel.deleteOne({_id:id})
     if (value.deletedCount > 0) {
        return res.status(200).json({
            message: "super is deleted",
           
          });
     }else{
        return next(new BadRequestError(400, "Not found"));
     }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async all(req, res, next) {
    try {
     
      let all = await superModel.find({})
      return res.status(200).json({
        message: "success",
        data:all
       
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async get(req, res, next) {
    try {
      let {id} =req.params;
      let super_admin = await superModel.findById(id)
      if (super_admin) {
        return res.status(200).json({
            message: "success",
            data:super_admin
           
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  
  
}

module.exports = new SuperController();
