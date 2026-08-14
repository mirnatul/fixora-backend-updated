import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoute } from "./modules/category/category.route";
import { technicianRoutes } from "./modules/technician/technician.route";
import { serviceRoutes } from "./modules/service/service.route";
import { bookingRoute } from "./modules/booking/booking.route";
import { reviewRoute } from "./modules/review/review.route";
import { paymentRoute } from "./modules/payment/payment.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { cloudinaryRoutes } from "./modules/cloudinary/cloudinary.route";
import passport from "passport"
import "./config/passport"

const app: Application = express();

// middleware

// for cookies credentials true (learn more)

const allowedOrigins = [
    "http://localhost:3000",
    config.app_url!,
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// webhook
// the link will just apply the raw and exclude json and then match the route
app.use("/api/payment/webhook", express.raw({ type: 'application/json' }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// for passport middleware
app.use(passport.initialize());


app.get("/", async (req: Request, res: Response) => {
    res.send("Hello, Prisma!");
})

// register
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoute);
app.use("/api/technician", technicianRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoute);
app.use("/api/review", reviewRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/cloudinary", cloudinaryRoutes);


app.use(notFound)

app.use(globalErrorHandler)

export default app;