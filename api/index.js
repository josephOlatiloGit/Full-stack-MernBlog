import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

const __dirname = path.resolve();

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// All middlewares

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

/**
 * Create the static file for the client side pages.
 * NOTE: If your are using vite you make use of dist, but if your are using create react app you will use build.
 */
app.use(express.static(path.join(__dirname, "/client/dist")));

// So whatever page that is not part of initial route path then we want to res with the file name and call the index.html:

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
// error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
