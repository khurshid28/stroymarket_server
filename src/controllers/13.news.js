const newsModel = require("../models/13.news");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class NewsController {
  async create(req, res, next) {
    try {
      let { title, subtitle, filename } = req.body;
     
      let news = await newsModel.create({
       
        image: filename ? "/static/news/" + filename : null,
        title,
        subtitle,
       
        
      });

      return res.status(201).json({
        message: "success",
        data: news,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let {  title,subtitle, filename } = req.body;
      let value = await newsModel.updateOne({ _id: id },{
        title,
        subtitle,
        
        image: filename ? "/static/news/" + filename : undefined,
      });
      if (value) {
        let news = await newsModel.findById(id);
        return res.status(200).json({
          message: "news is updated",
          data: news
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
      let value =await newsModel.deleteOne({_id:id})
     if (value.deletedCount > 0) {
        return res.status(200).json({
            message: "super is deleted",
            data :{
              _id:id
            }
           
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
     
      let all = await newsModel.find({})
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
      let news = await newsModel.findById(id)
      if (news) {
        return res.status(200).json({
            message: "success",
            data:news
           
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  
  
}

module.exports = new NewsController();