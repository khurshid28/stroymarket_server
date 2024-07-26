const serviceModel = require("../models/11.service");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class ServiceController {
  async create(req, res, next) {
    try {
      let { name_uz,name_ru,name_en, desc, filename } = req.body;

      let service = await serviceModel.create({
        name_uz,name_ru,name_en,
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

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { name_uz,name_ru,name_en, desc, filename } = req.body;
      let value = await serviceModel.updateOne({ _id: id },{
        name_uz,name_ru,name_en,
        desc,
        image: filename ? "/static/service/" + filename : undefined,
      });
      if (value) {
        let service = await serviceModel.findById(id);
        return res.status(200).json({
          message: "service is updated",
          data: service
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
          message: "service is deleted",
          data : {
            _id : id
          }
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
