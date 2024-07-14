const productModel = require("../models/7.product");
const shopModel = require("../models/5.shop");
const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class ProductController {
  async create(req, res, next) {
    try {
      let { name, category_id, filename, desc, type } = req.body;

      let product = await productModel.create({
        category_id,
        name,
        image: filename ? "/static/product/" + filename : null,
        desc,
        type,
      });

      return res.status(201).json({
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
      let value = await productModel.deleteOne({ _id: id });
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

  async deleteItem(req, res, next) {
    try {
      let { id, item_id } = req.params;

      let shop = await shopModel.findOne({ _id: req.user.shop_id });
      let index = shop.products.findIndex((x) => x._id == id);
      if (index > -1) {
        console.log(index);
        let kIndex = shop.products[index]["items"].findIndex(
          (x) => x._id == item_id
        );
        console.log(kIndex);
        console.log(item_id);
        if (kIndex > -1) {
          shop.products[index]["items"][kIndex].isDeleted = true;
          await shopModel.findByIdAndUpdate({ _id: req.user.shop_id }, shop);
        } else {
          return next(new NotFoundError(404, "Item Not found"));
        }
      } else {
        return next(new NotFoundError(404, "Not found"));
      }

      return res.status(200).json({
        message: "super is deleted",
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async moreAll(req, res, next) {
    try {
      let all = await productModel.find({
        count :  {$gt : 9}
      },null, {limit: 50});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async all(req, res, next) {
    try {
      let all = await productModel.find({});
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
      if (req.user.role == "Admin") {
        let { id } = req.params;

        let product = await productModel.findById(id);
        let shop = await shopModel.findById(req.user.shop_id);

        let result = shop.products.filter(
          (p) => p._id == id 
        );
        console.log(result);

        if (product) {
          // console.log(result[0].items);
          return res.status(200).json({
            message: "success",
            data: {
              ...product._doc,
              items: result.length > 0 ? result[0].items.filter(
                (item) => !item.isDeleted
              ) : [],
            },
          });
        }
      } else {
        let { id } = req.params;
        let product = await productModel.findById(id);
        if (product) {
          return res.status(200).json({
            message: "success",
            data: product,
          });
        }
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyCategoryId(req, res, next) {
    try {
      let { category_id } = req.query;
      console.log(req.query)
      let products = await productModel.find({
        category_id : category_id,
      });
      console.log(products);
      if (products) {
        return res.status(200).json({
          message: "success",
          data: products,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async add(req, res, next) {
    try {
      let { id } = req.params;
      let { name, price } = req.body;

      let products = await productModel.find({
        id,
      });
      if (products) {
        return res.status(200).json({
          message: "success",
          data: products,
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
