import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import productRoutes from "./routes/product.js";
import authRoutes from "./routes/auth.js";
import errorMiddleware from "./middlewares/errors.js";

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR ${err}`);
  console.log("Shutting down server due to unhandled uncaught exceptions");
});

dotenv.config({ path: "backend/config/config.env" });

//Connection database
connectDatabase();

app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);

//error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

//handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
