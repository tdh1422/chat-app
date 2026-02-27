const express = require("express");
const Message = require("../models/Message");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:room", authMiddleware, async (req, res) => {
  const msgs = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
  res.json(msgs);
});

router.post("/", authMiddleware, async (req, res) => {
  const msg = await Message.create({
    sender: req.user.id,
    content: req.body.content,
    room: req.body.room
  });

  res.json(msg);
});

module.exports = router;