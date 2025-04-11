const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");
const { body, query, param, validationResult } = require("express-validator");
const router = express.Router();

// Apply authentication middleware to all task routes
router.use(auth);

// Create a new task
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
    body("status").optional().isIn(["pending", "in_progress", "completed"]).withMessage("Status must be pending, in_progress, or completed"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, dueDate, status } = req.body;
      const userId = req.user.id;

      const task = await Task.createTask(userId, title, description, dueDate, status);

      res.status(201).json({
        message: "Task created successfully",
        task,
      });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ message: "Server error creating task" });
    }
  }
);

// Get all tasks for the authenticated user with filtering and sorting
router.get(
  "/",
  [
    query("status").optional().isIn(["pending", "in_progress", "completed"]).withMessage("Invalid status filter"),
    query("searchTerm").optional().trim(),
    query("sortBy").optional().isIn(["created_at", "updated_at", "due_date", "title", "status"]).withMessage("Invalid sort field"),
    query("sortOrder").optional().isIn(["asc", "desc", "ASC", "DESC"]).withMessage("Sort order must be ASC or DESC"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("offset").optional().isInt({ min: 0 }).withMessage("Offset must be a non-negative integer"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const filters = {
        status: req.query.status,
        searchTerm: req.query.searchTerm,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder || "DESC",
        limit: req.query.limit ? parseInt(req.query.limit) : 50,
        offset: req.query.offset ? parseInt(req.query.offset) : 0,
      };

      const tasks = await Task.getAllTasksByUser(userId, filters);

      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Server error retrieving tasks" });
    }
  }
);

// Get task statistics
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Task.getTaskStats(userId);

    res.json(stats);
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({ message: "Server error retrieving task statistics" });
  }
});

// Get a specific task by ID
router.get("/:id", [param("id").isInt().withMessage("Task ID must be an integer")], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.getTaskById(taskId, userId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error retrieving task" });
  }
});

// Update a task
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("Task ID must be an integer"),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty if provided"),
    body("description").optional().trim(),
    body("status").optional().isIn(["pending", "in_progress", "completed"]).withMessage("Status must be pending, in_progress, or completed"),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskId = req.params.id;
      const userId = req.user.id;
      const { title, description, status, dueDate } = req.body;

      // Check if task exists and belongs to this user
      const existingTask = await Task.getTaskById(taskId, userId);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const updates = { title, description, status, dueDate };
      const updatedTask = await Task.updateTask(taskId, userId, updates);

      res.json({
        message: "Task updated successfully",
        task: updatedTask,
      });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Server error updating task" });
    }
  }
);

// Delete a task
router.delete("/:id", [param("id").isInt().withMessage("Task ID must be an integer")], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const taskId = req.params.id;
    const userId = req.user.id;

    // Check if task exists and belongs to this user
    const existingTask = await Task.getTaskById(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deleted = await Task.deleteTask(taskId, userId);

    if (deleted) {
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete task" });
    }
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error deleting task" });
  }
});

module.exports = router;
