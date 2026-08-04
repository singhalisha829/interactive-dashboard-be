import express from "express";
import { fetchProducts } from "../controllers/productsController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, fetchProducts);

export default router;
