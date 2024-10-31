import { Router } from "express";
import { receiveCallerIds } from "../controllers/controller.js";

const app = Router();

app.post("/api/receive-processed-callerids", async (req, res) => {
  receiveCallerIds(req, res);
});

export default app;
