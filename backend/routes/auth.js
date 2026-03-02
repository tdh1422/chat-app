const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { validateRegister } = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimit");

const router = express.Router();

// Register
router.post("/register", validateRegister, async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const username = req.body.username.trim();

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({
      username,
      email,
      password: req.body.password
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      username: user.username
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }

    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;