const express = require('express');
const postController = require("../controllers/posts.controller");
const { Protect } = require('../middleware/auth.middleware');
const router = express.Router();

// GET /api/v1/posts
router.get('/', postController.getAllPosts);
router.get('/:id',postController.getPostById);

router.post('/',Protect,postController.createPost);
router.patch('/:id',Protect, postController.updatePost);
router.delete('/:id',Protect, postController.deletePost);


module.exports = router;  