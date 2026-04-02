// src/routes/index.js
const router = require('express').Router();
const postRouter = require("./posts.routes.js")
// ... after other imports
const authRouter = require('./auth.routes.js');


router.use('/posts', postRouter); 
// ... other router.use() calls
router.use('/auth', authRouter); // Mount at /api/v1/auth


module.exports = router