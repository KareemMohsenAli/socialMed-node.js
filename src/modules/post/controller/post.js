import moment from "moment";
import Post from "../../../../DB/model/Post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { AppError } from "../../../utils/AppError.js";
import Comment from "../../../../DB/model/Comment.model.js";
import { getallApiFeatures } from "../../../Refactors/Refactor.js";
 export const creatPost=async (req, res, next) => {
      const { content } = req.body;
      const userId = req.user._id;
      if (!userId) {
        return next(new AppError('Authentication required to create a post',401));
      }
      const uploadedImages = [];
      if (req.files && req.files.images) {
        for (const image of req.files.images) {
            const {public_id,secure_url} = await cloudinary.uploader.upload(image.path, {
            resource_type: 'image',
            folder:`socialMedia/images/user/${req.user.firstName}`, 
          });
          uploadedImages.push( {public_id,secure_url});
        }
        ///////////////////////////////////////////////////
      }
      // Upload video (if available)
  
      let result={}
      if (req.files && req.files.video) {
     
         const { public_id,secure_url}=await cloudinary.uploader.upload(req.files.video[0].path,
           { resource_type: 'video',folder: `socialMedia/videos/user/${req.user.firstName}`})
         result.public_id=public_id
         result.secure_url=secure_url
      }
      // Create a new post
      const newPost = new Post({
        content,
        images: uploadedImages,
        video:result,
        privacy:req.body?.privacy,
        createdBy: userId,
      });
      // Save the post
      await newPost.save();
  
      res.status(201).json({ message: 'Post created successfully'});
   
  };
  export const updatePost=async (req, res, next) => {
      const postId = req.params.postId;
      const userId = req.user._id;
      const { content} = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        return next(new AppError('Post not found',404));
      }
      // Check if the user is the owner of the post
      if (post.createdBy.toString() !== userId.toString()) {
        return next(new AppError('You are not authorized to update this post', 403));
      }
      // Update the post fields
      if (content) {
        post.content = content;
      }
  
      // Handle images
      if (req.files.images) {
        if (post.images.length > 0) {
          for (const image of post.images) {
           await cloudinary.uploader.destroy(image.public_id);
        }
        }
        const uploadedImages=[]
        for (const image of req.files.images) {
          const {public_id,secure_url} = await cloudinary.uploader.upload(image.path, {
          resource_type: 'images',
          folder:`socialMedia/image/user/${req.user.firstName}`, 
        });
        uploadedImages.push( {public_id,secure_url});
      }
  
        post.images = uploadedImages;
      }
  
      // Handle videos
      if (req.files.videos) {
        // Delete old video from Cloudinary if they exist
        if (post.video) {
              await cloudinary.uploader.destroy(post.video.public_id);
        }
  
        // Upload and save new videos to Cloudinary
            const {secure_url,public_id} = await cloudinary.uploader.upload(r, {
              folder: `socialMedia/videos/user/${req.user.firstName}`,
            });     
        post.video= {secure_url,public_id};
      }
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: 'Post updated successfully' });
    }

export const deletePost=async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return next(new AppError('Post not found',404 ));
    }

    // Check if the user is the owner of the post
    if (post.createdBy.toString() !== userId.toString()) {
      return next(new AppError('You are not authorized to delete this post',403 ));
    }
// ====================================================================delete comment
    // Delete the post's comments
    await Comment.deleteMany({ postId });
// ====================================================================

    // Delete any pictures associated with the post from Cloudinary
    if (post?.images.length > 0) {
      for (const image of post.images) {
       await cloudinary.uploader.destroy(image.public_id);
    }
    }
    //delete video
    if (post?.video) {
      await cloudinary.uploader.destroy(post.video.public_id);
}

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  }

export const getPosts=async(req,res,next)=>{
  if(req.user.isDeleted){
    return next(new AppError('cant get post because account is deleted ',404 ));
  }
  const getPost=await Post.find({privacy:"public"}).populate({
    path: "comments",
    populate: {
      path: "replies",
    },
  })
  .populate("unlikes")
  .populate({path:"likes",select:"firstName profileImage.secure_url"});
  res.status(200).json({ message: 'done',getPost });
}

export const getPost=async(req,res,next)=>{
  const postId = req.params.postId;
  const getPost=await Post.findById(postId)
  res.status(200).json({ message: 'done',getPost });
}

export const likePost= async (req, res,next) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    // Find the post by ID
    const post = await Post.findById(postId);
    // Check if the post exists
    if (!post) {
      return next(new AppError('Post not found',404 ));
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return next(new AppError('You have already liked this post',400 ));
    }
    // If the user has previously disliked the post, remove them from the "dislikes" array
    if (post.unlikes.includes(userId)) {
      post.unlikes.pull(userId);
    }
    post.likes.push(userId);
    // Save the updated post
    await post.save();
    res.status(200).json({ message: 'Post liked successfully' });
  }

export const unLike=async (req, res,next) => {
      const postId = req.params.postId;
      const userId = req.user._id;

      // Find the post by ID
      const post = await Post.findById(postId);
      // Check if the post exists
      if (!post) {
        return next(new AppError('Post not found',404 ));
      }
      // Check if the user has already disliked the post
      if (post.unlikes.includes(userId)) {
        return next(new AppError('You have already disliked this post',400 ));
      }
  
      // If the user has previously liked the post, remove them from the "likes" array
      if (post.likes.includes(userId)) {
        post.likes.pull(userId);
      }
  
      // Add the user's ID to the "dislikes" array
      post.unlikes.push(userId);
  
      // Save the updated post
      await post.save();
      res.status(200).json({ message: 'Post disliked successfully' });
    }

export const updatePrivacy=async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const newPrivacy = req.body.privacy;

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return next(new AppError('Post not found',404 ));
    }
    // Check if the user is the owner of the post
    if (post.createdBy.toString() !== userId.toString()) {
      return next(new AppError('You do not have permission to update the privacy of this post',403 ));

    }
    // Update the privacy of the post
    post.privacy = newPrivacy||"public";
    // Save the updated post
    await post.save();
    res.status(200).json({ message: 'Post privacy updated successfully' });
  }


export const yesterdayPosts=async (req, res) => {
    // Calculate the date for yesterday
    const yesterday = moment().subtract(1, 'days').startOf('day').toDate();

    const posts = await Post.find({ createdAt: { $gte: yesterday } }).exec();

    res.status(200).json({ message: 'Posts created yesterday', posts });
  }


export const getPostsCreatedToday=async (req, res) => {
    const currentDate = moment().format('YYYY-MM-DD');
    
    // Calculate the start and end of today
    const todayStart = moment(currentDate).startOf('day').toDate();
    const todayEnd = moment(currentDate).endOf('day').toDate();
    
    // Find posts created today
    const posts = await Post.find({ createdAt: { $gte: todayStart, $lte: todayEnd } }).exec();
    res.status(200).json({ message: 'Posts created today', posts });
  }

export const ApiFeaturesHandeling=getallApiFeatures(Post)
