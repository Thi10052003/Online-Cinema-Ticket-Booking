import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
// middlewares
app.use(express.json());
app.use("/user", userRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.shxan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
).then(
    () => app.listen(
        5001,
        () => console.log("Connected To Database And Server is Running")
    )
).catch((e) => console.log(e));

//3q7T43rbE.aL_nu
//mongodb+srv://admin:<db_password>@cluster0.shxan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0---
