const adminModel = require("../models/2.admin");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class AdminController {
  async create(req, res, next) {
    try {
      let { fullname, phone, shop_id, chat_id } = req.body;
      let login = cryptoRandomString({ length: 10 });
      let password = cryptoRandomString({ length: 15 });
      let admin = await adminModel.create({
        fullname,
        phone,
        shop_id,
        chat_id,
        login,
        password,
      });

      return res.status(201).json({
        message: "success",
        data: admin,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value = await adminModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "admin is deleted",
        });
      } else {
        return next(new BadRequestError(400, "Not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async all(req, res, next) {
    try {
      let all = await adminModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async get(req, res, next) {
    try {
      let { id } = req.params;
      let admin = await adminModel.findById(id);
      if (admin) {
        return res.status(200).json({
          message: "success",
          data: admin,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new AdminController();
