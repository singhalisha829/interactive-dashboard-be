import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import salesRoutes from "./src/routes/salesRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Your Next.js app URL
    credentials: true, // Allow cookies to be sent back & forth
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.status(200).send("ok"));

app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/products", productRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is running on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("database connection failed", err.message);
  });
