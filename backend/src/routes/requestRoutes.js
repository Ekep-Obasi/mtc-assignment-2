import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus
} from "../controllers/requestController.js";
import { createQuote, getQuotesForRequest } from "../controllers/quoteController.js";

const router = express.Router();

router.post("/", requireAuth, requireRole("resident"), createRequest);
router.get("/", requireAuth, getRequests);
router.get("/:id", requireAuth, getRequestById);
router.patch("/:id/status", requireAuth, requireRole("resident"), updateRequestStatus);

// quote sub-routes nested under requests
router.post("/:id/quotes", requireAuth, requireRole("provider"), createQuote);
router.get("/:id/quotes", requireAuth, getQuotesForRequest);

export default router;
