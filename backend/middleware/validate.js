const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters" });
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  next();
};