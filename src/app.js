import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routes/user.route.js";

// Routes declaration
app.use("/api/user", userRouter);

export { app };
