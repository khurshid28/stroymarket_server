const productModel = require("../models/7.product");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError } = require("../utils/errors");

class ProductController {
  async create(req, res, next) {
    try {
      let { name, category_id,filename,desc,type } = req.body;
      let login = cryptoRandomString({ length: 10 });
      let password = cryptoRandomString({ length: 15 });
      let product = await productModel.create({
        category_id,
        name,
        image: filename ? "/static/product/" + filename : null,
        desc,
        type
        
      });

      return res.status(200).json({
        message: "success",
        data: product,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value =await productModel.deleteOne({_id:id})
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
     
      let all = await productModel.find({})
      return res.status(200).json({
        message: "success",
        data: all
       
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async getbyId(req, res, next) {
    try {
      let {id} = req.params;
      let product = await productModel.findById(id)
      if (product) {
        return res.status(200).json({
            message: "success",
            data:product
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyCategoryId(req, res, next) {
    try {
      let {category_id} =req.query;
      let products = await productModel.find({
        category_id
      })
      if (products) {
        return res.status(200).json({
            message: "success",
            data: products
           
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  
  
}

module.exports = new ProductController();