const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Register a new user
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Create new user
      const user = await User.createUser(name, email, password);

      // Generate token
      const token = User.generateToken(user);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);

// User login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail().withMessage("Valid email is required"), body("password").notEmpty().withMessage("Password is required")],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Validate password
      const isPasswordValid = await User.validatePassword(user, password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = User.generateToken(user);

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error retrieving user" });
  }
});

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty if provided"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Valid email is required if provided"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const { name, email } = req.body;

      // Check if email is being updated and if it's already in use
      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "Email is already in use" });
        }
      }

      const updatedUser = await User.updateProfile(userId, { name, email });

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error updating profile" });
    }
  }
);

// Change password
router.put(
  "/password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      await User.updatePassword(userId, currentPassword, newPassword);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error.message === "Current password is incorrect") {
        return res.status(400).json({ message: error.message });
      }
      console.error("Password change error:", error);
      res.status(500).json({ message: "Server error changing password" });
    }
  }
);

module.exports = router;
