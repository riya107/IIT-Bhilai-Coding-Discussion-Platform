const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");

// @route   GET /api/posts
// @desc    Get all posts or similar posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const author = req.header("author");
    const filter = {};

    if (author) filter.author = author;

    const posts = await Post.find(filter).sort({ updatedAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    // Create a post attributed to the authenticated user only.
    const { title, body, snippet } = req.body;
    const user = await User.findById(req.user.id).select("username");
    if (!user) return res.status(401).json({ msg: "Unauthorized" });

    const newPost = new Post({
      title,
      body,
      snippet,
      author: user.username,
      views: 0,
      votes: 0,
    });

    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// @route   PUT /api/posts
// @desc    Update a post
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    const postId = req.body._id;
    if (!postId) return res.status(400).json({ error: "Missing post id" });

    const postDoc = await Post.findById(postId);
    if (!postDoc) return res.status(404).json({ error: "Post not found" });

    if (postDoc.author !== req.user.username)
      return res.status(403).json({ msg: "Forbidden: cannot edit others' posts" });

    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// @route   PUT /api/posts/:id
// @desc    Add a comment to a post
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: { ...req.body, time: new Date() } } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// @route   POST /api/posts/:id
// @desc    Upvote or downvote a post
// @access  Private
router.post("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { votes: req.body.inc } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error("Error updating votes:", err);
    res.status(500).json({ error: "Failed to update votes" });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a post and increment views
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false });

    if (post.author !== req.user.username)
      return res.status(403).json({ success: false, msg: "Forbidden" });

    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;