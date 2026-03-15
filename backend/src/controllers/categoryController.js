import Category from "../models/Category.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
