import express from "express";
import { fetchSales, createSales } from "../controllers/salesController.js";
import authenticate from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { createSalesSchema } from "../validators/salesValidator.js";

const router = express.Router();

router.get("/", authenticate, fetchSales);
router.post("/", authenticate, validate(createSalesSchema), createSales);

export default router;
