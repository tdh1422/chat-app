const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const router = express.Router();
const { validateRegister } = require("../middleware/validate");

// Register
router.post("/register", validateRegister, async (req, res) => {
  const user = await User.create(req.body);
  res.json({ user });
});

// Login
const { loginLimiter } = require("../middleware/rateLimit");

router.post("/login", loginLimiter, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("User not found");

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).send("Wrong password");

  const token = signToken(user);

  res.json({
    token,
    user: { id: user._id, email: user.email }
  });
});

module.exports = router;