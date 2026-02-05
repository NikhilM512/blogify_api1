const express = require('express');
const postController = require("../controllers/posts.controller")
const router = express.Router();

// GET /api/v1/posts
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

module.exports = router;