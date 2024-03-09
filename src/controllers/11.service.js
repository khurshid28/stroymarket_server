const serviceModel = require("../models/11.service");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class ServiceController {
  async create(req, res, next) {
    try {
      let { name, desc, filename } = req.body;

      let service = await serviceModel.create({
        name,
        desc,
        image: filename ? "/static/service/" + filename : null,
      });

      return res.status(201).json({
        message: "success",
        data: service,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async edit(req, res, next) {
    try {
      let { id } = req.params;
      let value = await serviceModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "super is deleted",
        });
      } else {
        return next(new BadRequestError(400, "Not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value = await serviceModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "super is deleted",
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
      let all = await serviceModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new ServiceController();
