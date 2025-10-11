import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./Middleware/error.middleware.js";
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/product.route.js"
import bannerRoute from "./routes/banner.route.js"
import userRoute from "./routes/user.route.js"
import orderRoute from "./routes/order.route.js"
import clinicRoute from "./routes/clinic.route.js";
import stripeRoute from "./routes/stripe.js"
import timetableRoute from "./routes/timetable.route.js";
import analyticsRoute from "./routes/analytics.route.js";
import bundleRoute from "./routes/bundle.routes.js";
import paymentRoute from "./routes/payment.route.js"; // Add this line

const app = express();

//cors
app.use(cors());

// json body
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute)
app.use("/api/v1/banners", bannerRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/orders", orderRoute)
app.use("/api/v1/stripe", stripeRoute)
app.use("/api/v1/clinic", clinicRoute);
app.use("/api/v1/timetable", timetableRoute)
app.use("/api/v1/bundles", bundleRoute)
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/payments", paymentRoute) // Add this line

// Error middleware
app.use(notFound);
app.use(errorHandler);

export default app;