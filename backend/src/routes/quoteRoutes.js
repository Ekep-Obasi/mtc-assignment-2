import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import { acceptQuote, getMyQuotes } from "../controllers/quoteController.js";

const router = express.Router();

router.patch("/:id/accept", requireAuth, requireRole("resident"), acceptQuote);
router.get("/mine", requireAuth, requireRole("provider"), getMyQuotes);

export default router;
