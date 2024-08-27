import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./Middleware/error.middleware.js";
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/product.route.js"
import bannerRoute from "./routes/banner.route.js"
import userRoute from "./routes/user.route.js"
import orderRoute from "./routes/order.route.js"

const app = express();

//cors
app.use(cors());

// json body
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute )
app.use("/api/v1/banners", bannerRoute )
app.use("/api/v1/users", userRoute )
app.use("/api/v1/orders", orderRoute )

// Error middleware
app.use(notFound);
app.use(errorHandler);


export default app;
