import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", requireAuth, createCategory);

export default router;
