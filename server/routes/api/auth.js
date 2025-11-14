const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./../../middleware/auth");
const User = require("../../models/User");

// @route   POST api/auth
// @desc    Authorize a user
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ msg: "Complete all the Fields" });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User doesn't exist" });

    const success = await bcrypt.compare(password, user.password);
    if (!success)
      return res
        .status(400)
        .json({ msg: "Username and password don't match" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 24 * 60 * 60,
    });

    res.json({
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET api/auth/user
// @desc    Find user by token
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const data = await User.findById(req.user.id).select("-password");
    res.json(data);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
