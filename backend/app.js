import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import productRoutes from "./routes/product.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import errorMiddleware from "./middlewares/errors.js";
import cors from "cors";

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR ${err}`);
  console.log("Shutting down server due to unhandled uncaught exceptions");
});

if (process.env.NODE_ENV === "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

//Connection database
connectDatabase();

app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(cookieParser());
//routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

//error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV}`,
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
