import express from "express";
const router = express.Router();
import { Auth } from "../controllers/Authcontroller.js";
router.get("/auth", Auth)

export default router;