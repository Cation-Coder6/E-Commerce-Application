//dotenv
require("dotenv").config();

//express-async-errors
require("express-async-errors");

//express
const express = require("express");
const app = express();

//rest of the pakages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
//port
const port = process.env.PORT || 5000;

//mongodb
const connectDB = require("./db/connect");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//security pakages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

//using morgan
app.use(morgan("tiny"));

//json middleware
app.use(express.json());

//using the cookie parser
app.use(cookieParser(process.env.JWT_SECRET));

//using file upload for uploading images
app.use(express.static("./public"));
app.use(fileUpload());

//using the front end
app.use(express.static("./public"));

//using cors to make requests from different localhosts/
app.use(cors());

//routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

app.get("/", (req, res) => {
  res.send("Get route works");
});

app.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies); //required once we set the signed property of cookies to true
  res.send("Get route works");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
