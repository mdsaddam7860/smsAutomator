import { app } from "./app.js";

const PORT = 8000;

app.listen(PORT, (err, req, res, next) => {
  console.log(`server running at http://localhost:${PORT}`);
});
