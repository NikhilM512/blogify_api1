const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // slug: String,
  description: String
});

const Tag = mongoose.model('Tag', tagSchema);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    content: {
      type: String,
      required: true
    },
     author: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
    },
    tags : [{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Tag'
    }]
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = {Post,Tag};