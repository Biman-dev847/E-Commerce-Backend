import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbconnect.js";
import authRouter from "./routes/authRoute.js";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { productRouter } from "./routes/productRoute.js";
import morgan from "morgan";
import blogRouter from "./routes/blogRoute.js";
import categoryRouter from "./routes/prodcategoryRoute.js";
import blogcategoryRouter from "./routes/blogCatRoute.js";
import brandRouter from "./routes/brandRoute.js";
import couponRouter from "./routes/couponRoute.js";
import colorRouter from "./routes/colorRoute.js";
import enqRouter from "./routes/enqRoute.js";
import { uploadRouter } from "./routes/uploadRoute.js";

// Loads .env file contents into process.env
dotenv.config();

/** Set up our server*/

// Create an express app
const app = express();

/** The CORS Policy Enables Cross-origin resource sharing (CORS) in 
Express Gateway. CORS defines a way in which a browser and server 
can interact and 
determine whether or not it is safe to allow a cross-origin request. */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);

// Create a port to run our server on
const PORT = process.env.PORT || 4000;

// Connect our database
dbConnect();

app.use(morgan("dev")); /** Morgan is an HTTP request level Middleware. 
It is a great tool that logs the requests along with some other 
information
depending upon its configuration and the preset used.*/
app.use(
  bodyParser.json()
); /**Returns middleware that only parses json and only 
looks at requests where the Content-Type header matches the type option.*/
app.use(
  bodyParser.urlencoded({ extended: false })
); /**Returns middleware that only parses urlencoded bodies and only 
looks at requests where the Content-Type header matches the type option */
app.use(cookieParser()); /**Use to parse cookies send in 
the request and transform them in JSON object */

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
