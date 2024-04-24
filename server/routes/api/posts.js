const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("./../../middleware/auth");

// Post model
const Post = require("../../models/Post");

// @route api/posts
// @descrption Get all posts
// @access Public
router.get("/", async (req, res) => {
  const author = req.header("author");
  const text = req.header("text");
  const filter = {};
  if (author) filter["author"] = author;

  if (text) {
    const response = await axios.post(
      `${process.env.VECTORDB_URL}/similar-posts`,
      { text: text }
    );
    const ids = response.data.ids;
    filter["_id"] = { $in: ids };

    Post.find(filter)
      .then((posts) => {
        // Sort the posts based on the order of IDs
        const sortedPosts = ids.map((id) =>
          posts.find((post) => post._id.toString() === id)
        );
        res.json(sortedPosts);
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    // If text header is not present, retrieve posts without sorting
    Post.find(filter)
      .sort({ updatedAt: -1 })
      .then((posts) => res.json(posts))
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
});

// @route api/posts
// @descrption Post a blogpost
// @access Private
router.post("/", auth, async (req, res) => {
  const { title, body, snippet, author } = req.body;
  const newpost = new Post({
    title,
    body,
    snippet,
    author,
    views: 0,
    votes: 0,
  });
  await axios.post(`${process.env.VECTORDB_URL}/store-post`, {
    id: newpost._id.toString(),
    post: `${title} ${body} ${snippet} ${author}`,
  });
  newpost
    .save()
    .then((post) => res.json(post))
    .catch((err) => console.log(err));
});

// @route api/posts
// @descrption Put/Update a post
// @access Private
router.put("/", auth, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { upsert: true },
    (err, post) => {
      if (err) throw err;
      res.json(post);
    }
  );
});

// @route api/posts/:id
// @descrption add a comment.
// @access Private
router.put("/:id", auth, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: { comments: { ...req.body, time: new Date() } },
    },
    { upsert: true, new: true },
    (err, post) => {
      if (err) throw err;
      res.json(post);
    }
  );
});

// @route api/posts/:id
// @descrption add a upvote
// @access Private
router.post("/:id", auth, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    {
      $inc: { votes: req.body.inc },
    },
    { new: true },
    (err, post) => {
      if (err) throw err;
      res.json(post);
    }
  );
});

// @route --> /api/posts/:id
// @description --> get a post
// @access Public
router.get("/:id", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { views: 1 } },
    { new: true },
    (err, post) => {
      if (err) throw err;
      res.json(post);
    }
  );
  // Post.findById(req.params.id)
  //   .update({ $inc: { views: 1 } })
  //   .then((post) => res.json(post))
  //   .catch((err) => res.status(404).json({ success: false }));
});

// @route --> /api/posts/:id
// @description --> delete a post
// @access Private
router.delete("/:id", auth, (req, res) => {
  Post.findById(req.params.id)
    .then((post) => post.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
