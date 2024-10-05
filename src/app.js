import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());

//routes import
import UserRouter from "./routes/user_routers.js";
import AdminRouter from "./routes/admin_routers.js";
import DoctorRouter from "./routes/doctor_routers.js";
import TempRouter from "./routes/temp_routers.js";
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/doctor", DoctorRouter);
app.use("/api/v1/temp", TempRouter);

// Global error-handling middleware (should be written after routes)
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle ApiError with a proper response
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle other unhandled errors (fallback)
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
export { app };
