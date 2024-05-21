const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("./../models/task.schema.js");
const router = express.Router();
const { JWT_SECRET } = require("./../infrastructure/config.js");

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

// Create task
router.post("/tasks", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user tasks
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
