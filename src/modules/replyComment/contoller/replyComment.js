import Comment from "../../../../DB/model/Comment.model.js";
import Post from "../../../../DB/model/Post.model.js";
import userModel from "../../../../DB/model/User.model.js";
import Reply from "../../../../DB/model/replyComment.model.js";
import { AppError } from "../../../utils/AppError.js";
export const createReplyComment=async (req, res, next) => {
      const commentId = req.params.commentId;
      const userId = req.user._id;
      const replyBody = req.body.comment;
      
      // Find the post by ID
      const comment = await Comment.findById(commentId);
      const user = await userModel.findById(userId);

      if (!comment) {
        return next(new AppError('comment not found',404));
      }

   // Check if the parent post is deleted
   const post = await Post.findById(comment.postId);
   if (post && post.isDeleted) {
     return next(new AppError('Cannot add a replyComment to a deleted post', 400));
   }
      if (!user) {
        return next(new AppError('User not found',404));

      }
    // Check if the user is deleted
      if (user.isDeleted) {
        return next(new AppError('Cannot add a replyComment. Your account is deleted.',400));
        
      }
      // Create a new replycomment
      const replyComment = new Reply({
        replyBody,
        createdBy: userId,
        commentId,
      });
      // Save the comment
      await replyComment.save();
      //push comment in comment comment's
      comment.replies.push(replyComment._id);
      await comment.save();
      res.status(201).json({ message: 'Comment added successfully', replyComment });
    }

export const updateReplyComment=async (req, res, next) => {
    const commentId = req.params.commentId;
    const updatedCommentBody = req.body.comment;

    // Find and update the comment
    const updatedComment = await Reply.findByIdAndUpdate(
      commentId,
      { replyBody: updatedCommentBody },
      { new: true }
    );

      // Check if the user is the owner of the comment
      if (updatedComment.createdBy.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this commennt',403 ));
      }

    if (!updatedComment) {
      return next(new AppError('replyComment not found',404));

    }

    res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
  }

export const deleteComment=async (req, res, next) => {
    const commentId = req.params.commentId;

    // Find the comment by ID
    const repliedComment = await Reply.findById(commentId);

    if (!repliedComment) {
      return next(new AppError('replyComment not found',404 ));

    }

    // Check if the user is the owner of the comment (compare as strings)
    if (repliedComment.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to delete this repliedcomment',403 ));

    }


    const parentComment = await Comment.findById(repliedComment.commentId);

    if (!parentComment) {
      return next(new AppError('Parent comment not found', { cause: 404 }));
    }

    // Remove the reply comment from the parent comment's 'replies' array
    parentComment.replies.pull(repliedComment._id);
    await parentComment.save();




    // Delete the comment
    await repliedComment.remove();




    res.status(200).json({ message: 'Comment deleted successfully' });
  } 


  export const likeReplyComment= async (req, res,next) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    // Find the post by ID
    const replyComment = await Reply.findById(commentId);
    // Check if the comment exists
    if (!replyComment) {
      return next(new AppError('replyComment not found',404 ));
    }

    // Check if the user has already liked the replyComment
    if (replyComment.likes.includes(userId)) {
      return next(new AppError('You have already liked this replyComment',400 ));
    }
    // If the user has previously disliked the replyComment, remove them from the "dislikes" array
    if (replyComment.unlikes.includes(userId)) {
      replyComment.unlikes.pull(userId);
    }
    replyComment.likes.push(userId);
    // Save the updated replyComment
    await replyComment.save();
    res.status(200).json({ message: 'replyComment liked successfully' });
  }

export const unLikeReplyComment=async (req, res,next) => {
      const commentId = req.params.commentId;
      const userId = req.user._id;

      // Find the comment by ID
      const replyComment = await Reply.findById(commentId);
      // Check if the comment exists
      if (!replyComment) {
        return next(new AppError('replyComment not found',404 ));
      }
      // Check if the user has already disliked the replyComment
      if (replyComment.unlikes.includes(userId)) {
        return next(new AppError('You have already disliked this replyComment',400 ));
      }
  
      // If the user has previously liked the replyComment, remove them from the "likes" array
      if (replyComment.likes.includes(userId)) {
        replyComment.likes.pull(userId);
      }
  
      // Add the user's ID to the "dislikes" array
      replyComment.unlikes.push(userId);
  
      // Save the updated replyComment
      await replyComment.save();
      res.status(200).json({ message: 'replyComment disliked successfully' });
    }

