const regionModel = require("../models/15.region");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError, NotFoundError } = require("../utils/errors");

class RegionController {
  async create(req, res, next) {
    try {
      let { name } = req.body;
    
      let region = await regionModel.create({
        name
      });

      return res.status(201).json({
        message: "success",
        data: region,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value =await regionModel.deleteOne({_id:id})
     if (value.deletedCount > 0) {
        return res.status(200).json({
            message: "region is deleted",
           
          });
     }else{
        return next(new NotFoundError(404, "Not found"));
     }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async all(req, res, next) {
    try {
     
      let all = await regionModel.find({})
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
      let region = await regionModel.findById(id)
      if (region) {
        return res.status(200).json({
            message: "success",
            data:region
           
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  
  
}

module.exports = new RegionController();
