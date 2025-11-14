const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !username || !password)
      return res.status(400).json({ msg: "Complete all the Fields." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "Email is already taken, use a different one." });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hash });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // expires in 1 day
    );

    res.json({
      token,
      user: { username: savedUser.username, email: savedUser.email },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ msg: "Server error while creating user." });
  }
});

// @route   POST /api/users/user
// @desc    Update user profile
// @access  Private
router.post("/user", auth, async (req, res) => {
  try {
    const { username: requestedUsername, info } = req.body;

    if (requestedUsername && requestedUsername !== req.user.username) {
      return res.status(403).json({ msg: "Forbidden: cannot update another user's profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { info } },
      { new: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found." });
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ msg: "Something went wrong." });
  }
});

// @route   GET /api/users/validateuser
// @desc    Check if a username exists
// @access  Public
router.get("/validateuser", async (req, res) => {
  try {
    const username = req.header("username");
    const user = await User.findOne({ username }).select("-password");
    res.json(!!user);
  } catch (err) {
    console.error("Error validating username:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   GET /api/users/validateemail
// @desc    Check if an email exists
// @access  Public
router.get("/validateemail", async (req, res) => {
  try {
    const email = req.header("email");
    const user = await User.findOne({ email }).select("-password");
    res.json(!!user);
  } catch (err) {
    console.error("Error validating email:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by username
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.id }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ msg: "User Not Found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Cannot get the user. Try again later." });
  }
});

module.exports = router;
