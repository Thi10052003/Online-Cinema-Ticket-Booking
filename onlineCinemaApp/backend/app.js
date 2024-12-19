import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable for PORT

// Middleware
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MongoDB Connection
const MONGO_URI = `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.shxan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true, // Ensures transactions can be retried
    w: "majority", // Guarantees write acknowledgment
  })
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit process on database connection failure
  });

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
