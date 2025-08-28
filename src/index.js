import { app } from "./app.js";
import dotenv from "dotenv";
import { ApiError } from "./utils/ApiError.js";
import { smsController } from "./controllers/user.controller.js";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT ?? 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

try {
  app.listen(PORT, async (err, req, res, next) => {
    console.log(`server running at http://localhost:${PORT}`);

    // try {
    //   const result = await smsController();
    //   console.log("SMS scheduler started", result);
    // } catch (error) {
    //   throw new ApiError(500, "Failed to start server", error);
    // }
  });
} catch (error) {
  throw ApiError(500, "Failed to start server", error);
}
