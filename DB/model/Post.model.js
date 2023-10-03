import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  images: {type:Array},
  video: Object,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
  ],
  unlikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  privacy: {
    type: String,
    enum: ['only me', 'public'],
    default: 'public',
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
