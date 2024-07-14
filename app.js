

const dotenv = require("dotenv");
const path = require("path");


dotenv.config();
require("./src/config/db.js");

var express = require("express");

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// all routes
const router = require("./src/routes/_index.js");

// built in middlewares
const logger = require("./src/middlewares/logger.js");
const rateLimit = require("./src/middlewares/rate-limit.js");
const errorHandler = require("./src/middlewares/error-handler.js");
const authMiddleware = require("./src/middlewares/authMiddleware");


const app = express();


// PORT
const PORT = process.env.PORT || 5090;


app.use(express.json({limit: '20mb'}),);
app.use(express.urlencoded({extended:true,limit: '20mb',parameterLimit : 20}));
app.use(morgan("dev"), cors(), rateLimit(),authMiddleware );

// testing server
app.get("/", (req, res) => res.send("STROY MARKET API"));

// all routes
app.use("",router);





app.use(helmet());

// error handling
app.use(errorHandler);
app.use(logger);






// static
app.use("/static", express.static(path.join(__dirname, "public")));

// starting server
app.listen(PORT, async () => {
  console.log(`server ready on port:${PORT}`);
});




//schedule
require("./src/utils/schedule")

//bot
require("./src/bot/support")

