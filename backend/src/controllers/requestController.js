import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";
import { REQUEST_TRANSITIONS } from "../utils/constants.js";

export const createRequest = async (req, res, next) => {
  try {
    const { title, description, categoryId, location } = req.body;

    if (!title || !description || !categoryId || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const request = await ServiceRequest.create({
      title,
      description,
      categoryId,
      location,
      createdBy: req.session.userId
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const { status, categoryId, q } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    let query;
    if (q) {
      filter.$text = { $search: q };
      query = ServiceRequest.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } });
    } else {
      query = ServiceRequest.find(filter).sort({ createdAt: -1 });
    }

    const requests = await query
      .populate("categoryId", "name")
      .populate("createdBy", "fullName email");

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    const request = await ServiceRequest.findById(id)
      .populate("categoryId", "name")
      .populate("createdBy", "fullName email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    next(err);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid request ID" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.createdBy.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You can only update your own requests" });
    }

    const allowed = REQUEST_TRANSITIONS[request.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from '${request.status}' to '${status}'`
      });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    next(err);
  }
};
