const ProductItemModel = require("../models/17.productItem");
const shopModel = require("../models/5.shop");
const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class ProductItemController {
 
  async update(req, res, next) {
    try {
      let { id } = req.params;
      let {   name,product_id,filename } = req.body;
      let value = await ProductItemModel.updateOne({ _id: id },{
        name,product_id,image : filename ? "/static/productitem/" + filename : undefined,
      });
      if (value) {
        let category = await ProductItemModel.findById(id);
        return res.status(200).json({
          message: "ProductItem is updated",
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
      let value = await ProductItemModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "ProductItem is deleted",
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
      let all = await ProductItemModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  
  async getbyId(req, res, next) {
    try {
      
        let { id } = req.params;
        let ProductItem = await ProductItemModel.findById(id);
        if (ProductItem) {
          return res.status(200).json({
            message: "success",
            data: ProductItem,
          });
        }
      
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyProductId(req, res, next) {
    try {
      let { product_id } = req.query;
      console.log(req.query)
      let ProductItems = await ProductItemModel.find({
        product_id 
      });
      console.log(ProductItems);
      if (ProductItems) {
        return res.status(200).json({
          message: "success",
          data: ProductItems,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async create(req, res, next) {
    try {
      
      let { name,product_id,filename } = req.body;

      let ProductItems = await ProductItemModel.create({
        name,product_id,image : filename ? "/static/productitem/" + filename : undefined,
      });
      if (ProductItems) {
        return res.status(201).json({
          message: "success",
          data: ProductItems,
        });
      }
      return next(new BadRequestError(400, "Some Error"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new ProductItemController();
