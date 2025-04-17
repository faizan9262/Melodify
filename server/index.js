// index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import moodRouter from "./routes/mood.routes.js";
import spotifyRouter from "./routes/spotify.routes.js";
import historyRouter from "./routes/history.routes.js";
import playlistRouter from "./routes/playlist.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://melodify-mood.vercel.app" // add your frontend vercel domain
    ],
    credentials: true,
  })
);

// app.options('*', cors({
//   origin: ["https://melodify-mood.vercel.app"],
//   credentials: true
// }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/auth/spotify", spotifyRouter);
app.use("/api/mood", moodRouter);
app.use("/api/", historyRouter);
app.use("/api/user/playlist", playlistRouter);

// Connect services
connectDB();
connectCloudinary();

export default app;
