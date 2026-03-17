// const Post = require('../models/post.model.js');
// const { Post } = require('../routes/posts.routes.js');

const { Post } = require("../models/post.model");

const getAllPosts = async (queryParams) => {

  const { author, sortBy, limit = 10, page = 1 } = queryParams;

  // 2. Build the initial filter object
  const filter = {};
  if (author) {
    filter.author = author;
  }
  // We could add more filters here, e.g., if (category) { filter.category = category; }

  // 3. Build the sort object
  const sortOptions = {};
  if (sortBy) {
    const [field, order] = sortBy.split(':'); // e.g., "createdAt:desc"
    sortOptions[field] = order === 'desc' ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default to newest first
  }
  
  // 4. Calculate pagination
  const limitValue = parseInt(limit);
  const skipValue = (parseInt(page) - 1) * limitValue;

  // 5. Chain it all together in a single Mongoose query
  const posts = await Post.find(filter)
    .sort(sortOptions)
    .skip(skipValue)
    .limit(limitValue)
    .populate('tags'); // We can still populate!

  return posts;
};


  // return await Post.find({});
// };

const getPostById = async (postId) => {
  if (!postId) {
    throw { status: 400, message: 'post id is required (use /posts/:id or ?id=)' };
  }
  const post = await Post.findById(postId).populate('author',"username email");
  if (!post) {
    
    throw { status: 404, message: 'Post not found' };
  }

  return post;
};

const createPost = async ({ title, content,author,tags }) => {
  if (!title) {
    throw { status: 400, message: 'Title is required' };
  }
    // const jsTag = await Post.Tag.create({ name: 'JavaScript', slug: 'javascript' });
    // const nodeTag = await Tag.create({ name: 'Node.js', slug: 'nodejs' });
    // const mongoTag = await Tag.create({ name: 'MongoDB', slug: 'mongodb' });
    // console.log(jsTag,mongoTag,nodeTag)
    const newPost = await new Post({ title, content, author,tags });
    newPost.save();
    return newPost;
};

const updatePost = async (postId, updateData) => {
  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedPost) {
    throw { status: 404, message: `Post with ID ${postId} not found` };
  }

  return updatedPost;
};

const deletePost = async (postId) => {
  // console.log(req.params.id)
  const post = await Post.findById(postId);
  console.log(post,"ard",postId)
  // if (post.userId.toString() !== req.user.id) {
  //   return res.status(403).json({ error: "You cannot delete someone else's post" });
  // }
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    throw { status: 404, message: `Post with ID ${postId} not found` };
  }
  return deletedPost;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};








































// const Post = require('../models/post.model'); // The service interacts with the model


// const getAllPosts=async()=>{
//   const allPosts = await Post.find({});
//   return allPosts;
// }

// const createPost = async (postData) => {
//   const newPost = await Post.create(postData);
//   return newPost;
// };


// module.exports = {
//   createPost,
//   getAllPosts
// };


// services/posts.services.js