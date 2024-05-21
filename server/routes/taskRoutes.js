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

// Update a single user task
router.put("/tasks/:taskId", auth, async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    Object.assign(task, updates);
    await task.save();

    res.send(task);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error);
  }
});

// Delete a user's task
router.delete('/tasks/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.id,
    });
    
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    res.send({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = router;
