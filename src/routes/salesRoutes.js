import express from "express";
import { fetchSales } from "../controllers/salesController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, fetchSales);

export default router;
