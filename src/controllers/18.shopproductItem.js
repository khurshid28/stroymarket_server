const ShopProductItemModel = require("../models/18.shopProductItem");
const shopModel = require("../models/5.shop");
const adminModel = require("../models/2.admin");
const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class ShopProductItemController {
    async create(req, res, next) {
        try {
          
          let { price,product_id,item_id } = req.body;

          
          let admin = await adminModel.findById(req.user._id);
         
          let ShopProductItem = await ShopProductItemModel.create({
            price,product_id,item_id,shop_id:admin.shop_id
           
          });
          if (ShopProductItem) {
            return res.status(201).json({
              message: "success",
              data: ShopProductItem,
            });
          }
          return next(new BadRequestError(400, "Some Error"));
        } catch (error) {
          console.log(error);
          return next(new InternalServerError(500, error.message));
        }
      }
 
  async update(req, res, next) {
    try {
      let { id } = req.params;
      let {   price,product_id,item_id } = req.body;
      let value = await ShopProductItemModel.updateOne({ _id: id },{
        price,product_id,item_id
      });
      if (value) {
        let ShopProductItem = await ShopProductItemModel.findById(id);
        return res.status(200).json({
          message: "ShopProductItem is updated",
          data: ShopProductItem
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
      let value = await ShopProductItemModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "ShopProductItem is deleted",
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
      let all ;
      if(req.user.role =="Super"){
       all = await ShopProductItemModel.find({});
      }else{
        let admin = await adminModel.findById(req.user._id);
        all = await ShopProductItemModel.find({ shop_id : admin.shop_id });
      }
      
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
        let ShopProductItem = await ShopProductItemModel.findById(id);
        if (ShopProductItem) {
          return res.status(200).json({
            message: "success",
            data: ShopProductItem,
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
      console.log(req.query);

      let ShopProductItem; 

      if(req.user.role =="Super"){
        ShopProductItem == await ShopProductItemModel.find({
          product_id,
        });
  
       }else{
         let admin = await adminModel.findById(req.user._id);
         ShopProductItem = await ShopProductItemModel.find({ shop_id : admin.shop_id,product_id, });
       }

      console.log(ShopProductItem);
      if (ShopProductItem) {
        return res.status(200).json({
          message: "success",
          data: ShopProductItem,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

 
}

module.exports = new ShopProductItemController();
