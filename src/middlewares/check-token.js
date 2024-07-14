const jwt = require("../utils/jwt.js");
const User = require("../models/1.user");
const Super = require("../models/4.super");
const Admin = require("../models/2.admin.js");

const {
  AuthorizationError,
  ForbiddenError,
  InternalServerError,
  InvalidTokenError,
} = require("../utils/errors.js");
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);
    if (!token) {
      return next(new AuthorizationError(401, "No token provided"));
    }

    const { id, agent, role } = jwt.verify(token);

    let user;
    if (role == "User") {
      console.log(await User.findOne({
       
      }));
      user = await User.findOne({
        _id:id,
        work_status:"working"
      });
      // console.log(">>>>>>>>>");
      // console.log(user);
    } else if (role == "Admin") {
      user = await Admin.findOne({
        _id:id,
        // work_status:"working"
      });
    } else if (role == "Super") {
      user = await Super.findOne({
        _id:id,
        work_status:"working"
      });
    }
  //  console.log(user);
  //  console.log({ id, agent, role });
    if (!user) {
      return next(new AuthorizationError(401, "Invalid token"));
    }

    // const reqAgent = req.headers["user-agent"];
    // if (agent !== reqAgent) {
    //     return next(
    //         new ForbiddenError(403, "You can't log in different devices")
    //     );
    // }

    req.user = user 
    

    return next();
  } catch (error) {
    console.log("check token >>");
    console.log(error);
    if (error instanceof TokenExpiredError) {
      return next(new AuthorizationError(403, "Token has expired"));
    } else if (error instanceof JsonWebTokenError) {
      return next(new InvalidTokenError(401, "Malformed token"));
    }

    return next(new InternalServerError(500, error));
  }
};
