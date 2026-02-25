const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

router.get("/:room", async (req, res) => {
  const msgs = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
  res.json(msgs);
});

router.post("/", async (req, res) => {
  const msg = await Message.create(req.body);
  res.json(msg);
});

module.exports = router;