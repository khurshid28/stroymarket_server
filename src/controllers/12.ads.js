const adsModel = require("../models/12.ads");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class AdsController {
  async create(req, res, next) {
    try {
      let { title, subtitle, filename,expired } = req.body;
     
      let ads = await adsModel.create({
        image: filename ? "/static/ads/" + filename : null,
        title,
        subtitle,
        expired : new Date(expired)
        
      });

      return res.status(201).json({
        message: "success",
        data: ads,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let {  title,subtitle,expired, filename } = req.body;
      let value = await adsModel.updateOne({ _id: id },{
        title,
        subtitle,
        expired : expired ?  new Date(expired) :undefined,
        image: filename ? "/static/ads/" + filename : undefined,
      });
      if (value) {
        let ads = await adsModel.findById(id);
        return res.status(200).json({
          message: "ads is updated",
          data: ads
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
      let value =await adsModel.deleteOne({_id:id});
     if (value.deletedCount > 0) {
        return res.status(200).json({
            message: "Ads is deleted",
            data :{
              _id :id
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
     
      let all = await adsModel.find({})
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
      let news = await adsModel.findById(id)
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

module.exports = new AdsController();