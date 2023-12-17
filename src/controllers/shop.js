







class ShopController {
  async getAll(req, res, next) {
    try {
     
        return res.status(200).json({
            "message":"success",
            "data":[]
        });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message)); 
    }
  }

  
}


module.exports = new ShopController();
