const workerModel = require("../models/10.worker");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class WorkerController {
  async create(req, res, next) {
    try {
      let { fullname, phone, service_id,filename,amount,payment_type,desc } = req.body;
      let login = cryptoRandomString({ length: 10 });
      let password = cryptoRandomString({ length: 15 });
      let workerOne = await workerModel.create({
        service_id,
        fullname,
        phone,
        image: filename ? "/static/worker/" + filename : null,
        amount,
        payment_type,
        login,
        password,
        desc,
        
      });

      return res.status(201).json({
        message: "success",
        data: workerOne,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value =await workerModel.deleteOne({_id:id})
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
     
      let all = await workerModel.find({})
      return res.status(200).json({
        message: "success",
        data:all
       
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async getbyId(req, res, next) {
    try {
      let {id} = req.params;
      let worker = await workerModel.findById(id);
      console.log(">> worker : ");
      console.log(worker);
      if (worker) {
        return res.status(200).json({
            message: "success",
            data:worker
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyServiceId(req, res, next) {
    try {
      let {service_id} =req.query;
      let workers = await workerModel.find({
        service_id
      })
      if (workers) {
        return res.status(200).json({
            message: "success",
            data:workers
           
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  
  
}

module.exports = new WorkerController();