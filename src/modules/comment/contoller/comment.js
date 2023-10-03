import Comment from "../../../../DB/model/Comment.model.js";
import Post from "../../../../DB/model/Post.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { AppError } from "../../../utils/AppError.js";
export const createComment=async (req, res, next) => {
      const postId = req.params.postId;
      const userId = req.user._id;
      const commentBody = req.body.comment;
      
      // Find the post by ID
      const post = await Post.findById(postId);
      const user = await userModel.findById(userId);
      if (!post) {
        return next(new AppError('post not found',404));

      }
  
      // Check if the post is deleted
      if (post.isDeleted) {
        return next(new AppError('Cannot add a comment to a deleted post',400));

      }

      if (!user) {
        return next(new AppError('User not found',404));

      }
    // Check if the user is deleted
      if (user.isDeleted) {
        return next(new AppError('Cannot add a comment. Your account is deleted.',400));
        
      }
      // Create a new comment
      const comment = new Comment({
        commentBody,
        createdBy: userId,
        postId,
      });
      // Save the comment
      await comment.save();
      //push comment in post comment's
      post.comments.push(comment._id)
      await post.save()
      res.status(201).json({ message: 'Comment added successfully', comment });
    }

export const updateComment=async (req, res, next) => {
    const commentId = req.params.commentId;
    const updatedCommentBody = req.body.comment;

    // Find and update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { commentBody: updatedCommentBody },
      { new: true }
    );

      // Check if the user is the owner of the comment
      if (updatedComment.createdBy.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this commennt',403 ));
      }

    if (!updatedComment) {
      return next(new AppError('Comment not found',404));

    }

    res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
  }

export const deleteComment=async (req, res, next) => {
    const commentId = req.params.commentId;

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(new AppError('Comment not foundt',404 ));

    }

    // Check if the user is the owner of the comment (compare as strings)
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to delete this comment',403 ));
    }

        // Remove the comment's ID from the Post's comments array
        await Post.findByIdAndUpdate(
          comment.postId,
          {
            $pull: { comments: commentId },
          },
          { new: true }
        );
    

    // Delete the comment
    await comment.remove();
    

    res.status(200).json({ message: 'Comment deleted successfully' });
  } 


  export const likeComment= async (req, res,next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    // Find the post by ID
    const comment = await Comment.findById(commentId);
    console.log(comment)
    // Check if the comment exists
    if (!comment) {
      return next(new AppError('comment not found',404 ));
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return next(new AppError('You have already liked this comment',400 ));
    }
    // If the user has previously disliked the comment, remove them from the "dislikes" array
    if (comment.unlikes.includes(userId)) {
      comment.unlikes.pull(userId);
    }
    comment.likes.push(userId);
    // Save the updated comment
    await comment.save();
    res.status(200).json({ message: 'comment liked successfully' });
  }

export const unLikeComment=async (req, res,next) => {
      const commentId = req.params.commentId;
      const userId = req.user._id;

      // Find the comment by ID
      const comment = await Comment.findById(commentId);
      // Check if the comment exists
      if (!comment) {
        return next(new AppError('comment not found',404 ));
      }
      // Check if the user has already disliked the comment
      if (comment.unlikes.includes(userId)) {
        return next(new AppError('You have already disliked this comment',400 ));
      }
  
      // If the user has previously liked the comment, remove them from the "likes" array
      if (comment.likes.includes(userId)) {
        comment.likes.pull(userId);
      }
  
      // Add the user's ID to the "dislikes" array
      comment.unlikes.push(userId);
  
      // Save the updated comment
      await comment.save();
      res.status(200).json({ message: 'comment disliked successfully' });
    }

