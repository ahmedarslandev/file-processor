import e from "express";
import dotenv from "dotenv";
import { startProcessingInterval } from "./lib/fileProcessing/intervalSetup.js";
import routes from "./routes/routes.js"

dotenv.config();

const app = e();
const port = process.env.PORT || 4000;
startProcessingInterval()

app.use(e.json());
app.use("/" , routes)

app.get("/", function (req, res) {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
