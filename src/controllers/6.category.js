const categoryModel = require("../models/6.category");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class CategoryController {
  async create(req, res, next) {
    try {
      let { name_uz,name_ru,name_en, desc, filename } = req.body;

      let category = await categoryModel.create({
        name_uz,name_ru,name_en,
        desc,
        image: filename ? "/static/category/" + filename : null,
      });

      return res.status(201).json({
        message: "success",
        data: category,
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
      let value = await categoryModel.updateOne({ _id: id },{
        name_uz,name_ru,name_en,
        desc,
        image: filename ? "/static/category/" + filename : undefined,
      });
      if (value) {
        let category = await categoryModel.findById(id);
        return res.status(200).json({
          message: "category is updated",
          data: category
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
      let value = await categoryModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "category is deleted",
          data :{
            _id :id
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
      let all = await categoryModel.find({});
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

module.exports = new CategoryController();
