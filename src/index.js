import { app } from "./app.js";
import dotenv from "dotenv";
import { ApiError } from "./utils/ApiError.js";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, (err, req, res, next) => {
    console.log(`server running at http://localhost:${PORT}`);
  });
} catch (error) {
  throw ApiError(500, "Failed to start server", error);
}
