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

//port
const port = process.env.PORT || 5000;

//mongodb
const connectDB = require("./db/connect");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//using morgan
app.use(morgan("tiny"));

//json middleware
app.use(express.json());

//using the cookie parser
app.use(cookieParser(process.env.JWT_SECRET));

//using the front end
app.use(express.static("./public"));

//using cors to make requests from different localhosts/
app.use(cors());

//routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

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
