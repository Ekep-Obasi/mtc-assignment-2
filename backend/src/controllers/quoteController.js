import mongoose from "mongoose";
import Quote from "../models/Quote.js";
import ServiceRequest from "../models/ServiceRequest.js";

export const createQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price, message, daysToComplete } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    if (!price || !message || !daysToComplete) {
      return res.status(400).json({ message: "price, message, and daysToComplete are required" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!["open", "quoted"].includes(request.status)) {
      return res.status(400).json({ message: "Can only quote on open or quoted requests" });
    }

    // prevent duplicate quote by same provider
    const existing = await Quote.findOne({
      requestId: id,
      providerId: req.session.userId
    });
    if (existing) {
      return res.status(409).json({ message: "You already submitted a quote for this request" });
    }

    const quote = await Quote.create({
      requestId: id,
      providerId: req.session.userId,
      price,
      message,
      daysToComplete
    });

    // auto-transition request to "quoted" if it's still "open"
    if (request.status === "open") {
      request.status = "quoted";
      await request.save();
    }

    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
};

export const getQuotesForRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    let filter = { requestId: id };

    // residents can only see quotes for their own requests
    if (req.session.role === "resident") {
      if (request.createdBy.toString() !== req.session.userId.toString()) {
        return res.status(403).json({ message: "You can only view quotes for your own requests" });
      }
    }

    // providers only see their own quotes
    if (req.session.role === "provider") {
      filter.providerId = req.session.userId;
    }

    const quotes = await Quote.find(filter)
      .populate("providerId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

export const acceptQuote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const request = await ServiceRequest.findById(quote.requestId);
    if (!request) {
      return res.status(404).json({ message: "Associated request not found" });
    }

    if (request.createdBy.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You can only accept quotes for your own requests" });
    }

    if (["completed", "cancelled"].includes(request.status)) {
      return res.status(400).json({ message: "Cannot accept quotes on a completed or cancelled request" });
    }

    if (quote.status !== "pending") {
      return res.status(400).json({ message: "This quote has already been processed" });
    }

    // accept this quote, reject all others, update request
    quote.status = "accepted";
    await quote.save();

    await Quote.updateMany(
      { requestId: quote.requestId, _id: { $ne: quote._id } },
      { status: "rejected" }
    );

    request.status = "assigned";
    request.acceptedQuoteId = quote._id;
    await request.save();

    res.json({ message: "Quote accepted", quote, request });
  } catch (err) {
    next(err);
  }
};

export const getMyQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ providerId: req.session.userId })
      .populate({
        path: "requestId",
        select: "title status location",
        populate: { path: "categoryId", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (err) {
    next(err);
  }
};
