import { Router } from "express";
import { smsController } from "../controllers/user.controller.js";

const router = Router();

router.route("/autoSendsms").get(smsController);

export default router;
