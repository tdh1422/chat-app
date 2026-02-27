const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // 5 lần sai
  message: "Too many login attempts"
});