import bcrypt from "bcrypt";
import User from "../models/users.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {

  try {

    const { fullName, email, password, role } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role
    });

    res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

export const logout = (req, res) => {

  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });

};

export const me = async (req, res) => {

  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.session.userId).select("-passwordHash");

  res.json(user);

};