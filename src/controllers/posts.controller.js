
// const { Tag } = require('../models/post.model.js');
const { Post } = require('../models/post.model.js');
const postService = require('../services/posts.services.js');

const getAllPosts = async (req, res, next) => {
  try {
    const allPosts = await postService.getAllPosts(req.query);
    res.status(200).json({ success: true, data: { posts: allPosts } });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const postId = req.params?.id || req.query?.id || null;
    const post = await postService.getPostById(postId);
    res.status(200).json({ success: true, data: { post } });
  } catch (err) {
    next(err)
  }
};

const createPost = async (req, res, next) => {
  try {
    console.log(req.body)
    const {title,content,author,tags}=req.body;
    const newPost = await postService.createPost({ title, content, author,tags });
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    next(err)
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;
    const updatedPost = await postService.updatePost(postId, updateData);
    res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    next(err)
  }
};

const deletePost = async (req, res, next) => {
   try {
    const postId = req.params.id;
    const currentUserId = req.user.id; // From the middleware

    // 1. Find the post first (don't delete it yet!)
    const post = await Post.findById(postId);

    // 2. Check if post exists
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // 3. AUTHORIZATION CHECK
    // Compare the post's author ID with the requesting user's ID.
    // We use .toString() because MongoDB ObjectIds are objects, not strings.
    if (post.author.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post'
      });
    }

    // 4. If we pass the check, delete the post
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    next(error);
  }
  // try {
  //   const postId = req.params.id;
  //   let currentUserId=req.user.id
  //   if (post.author.toString() !== currentUserId) {
  //     return res.status(403).json({
  //       success: false,
  //       message: 'You are not authorized to delete this post'
  //     });
  //   }
  //   await postService.deletePost(postId,currentUserId);
  //   res.status(200).json({ success: true, message: 'Post deleted successfully' });
  // } catch (err) {
  //   next(err)
  // }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};






















// const Post = require('../models/post.model.js');
// const postService = require("../services/posts.services.js");

// const getAllPosts = async (req, res, next) => {

//     try {
//         // const allPosts = await Post.find({});
//         let allPosts = await postService.getAllPosts();

//         res.status(200).json({
//             success: true,
//             data: { posts: allPosts }
//         })
//         } catch (err) {
//             res.status(500).json({
//                 success: false,
//                 error: err.message
//             })
//             // next(err)
//         }

// }

// const getPostById = async (req, res) => {
//     try {
//         // const postsData = [
//         //     { id: 2, title: 'My Second Post', date: '2023-10-26', views: 222 },
//         //     { id: 1, title: 'My First Post', date: '2023-10-25', views: 223 }
//         // ];

//         // /post/:id

//         // Accept id from route params (preferred) or query string
//         const postId = req.params && req.params.id ? req.params.id : req.query && req.query.id ? req.query.id : null;

//         if (!postId) {
//             return res.status(400).json({ success: false, error: 'post id is required (use /posts/:id or ?id=)' });
//         }

//         const post = await Post.findById(postId);
//         // const post = postsData.find((p) => p.id == postId);

//         if (!post) {
//             return res.status(404).json({ success: false, error: 'Post not found' });
//         }

//         res.status(200).json({
//             success: true,
//             data: { post }
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// }

// // const createPost = async (req, res) => {
// //     // The developer is trying to get the title from the request body.
// //     // const { title } = req.body || {};
// //     let {content,title} = req.body;
// //     if (!title) {
// //         return res.status(400).json({ success: false, error: 'Title is required' });
// //     }
    
// //     let postData = {title,content}

// //     // (Imagine database logic to save the post would go here)
// //     const newPost = await Post.create(postData); 

// //     res.status(201).json({ message: `Post created with title: ${title}` });
// // };


// const createPost = async (req, res, next) => {
//   try {
//     // 2. Delegate the database work to the service
//     let {title,content} = req.body;

//     const newPost = await postService.createPost({title,content}); 

//     // The controller's only job now is to send the HTTP response
//     res.status(201).json({ success: true, data: newPost });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({"error":error.message})
//   }
// };




// const updatePost = async (req, res, next) => {
//   try {
//     const postId = req.params.id;   //   /:id
//     const updateData = req.body;

//     // Find the post by its ID and update it with the new data.
//     // { new: true } ensures that the updated document is returned.
//     const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { 
//         new: true,
//         runValidators: true // This is a good option to ensure the update follows your schema rules
//      });

//     // CRITICAL: Handle the "Not Found" case.
//     // If no document with that ID exists, findByIdAndUpdate returns null.
//     if (!updatedPost) {
//       return res.status(404).json({
//         success: false,
//         error: { message: `Post with ID ${postId} not found` }
//       });
//     }

//     // If successful, send back the updated post.
//     res.status(200).json({
//       success: true,
//       data: updatedPost
//     });

//   } catch (error) {
//     res.status(500).json({"error":error.message});
//   }
// };


// const deletePost = async (req,res)=>{
//     try {
//         let postId = req.params.id;
//         let deletedPost = await Post.findByIdAndDelete(postId);
        
//         if (!deletedPost) {
//         res.status(404).json({
//             success: false,
//             error: { message: `Post with ID ${postId} not found` }
//         });
//         }
//         res.status(200).json({
//             status:"Success",
//             "message":"Post deleted Successfully"
//         })
//     } catch (error) {
//         res.status(500).json({
//             status:"Failure",
//             "message":error.message
//         })
//     }
// }

// module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost }


// controllers/postController.js