import { Router } from "express";
import { smsController } from "../controllers/user.controller.js";

const router = Router();

router.route("/autoSendsms").post(smsController);

export default router;
