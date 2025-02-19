const sharp = require("sharp");
const PostModel = require("../Model/Post.module");
const UserModel = require("../Model/User.model");
const Comment = require("../Model/Comment.model");
const cloudinary = require("../Config/cloudinary")

exports.addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    if (!req.file || !caption) {
      return res.status(400).json({ message: "Caption and image are required" });
    }

    const authorId = req.id;

    const optimizedImage = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const cloudResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${optimizedImage.toString("base64")}`,
      { resource_type: "image" }
    );

    const post = await PostModel.create({
      caption,
      image: cloudResponse.url,
      author: authorId,
    });

    const user = await UserModel.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate("author", "-password");

    return res.status(201).json({ message: "Post Created", post });
  } catch (error) {
    console.error("Error adding new post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel
      .find()
      .sort({ createdAt: -1 })
      .populate("author", "-password")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "-password" }
      });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error getting all posts: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId)
      .populate("author", "-password")
      .populate({ path: "comments.author", select: "-password" });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.UserPosts = async (req, res) => {
  try {
    const authorId = req.params.id;
    const posts = await PostModel
      .find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate("author", "-password")
      .populate({ path: "comments.author", select: "-password" });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error("Error getting user posts: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.LikePost = async (req, res) => {
  try {
    const likedbyUserKiId = req.id;
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.updateOne({ $addToSet: { like: likedbyUserKiId } });
    await post.save();
    return res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.UnlikePost = async (req, res) => {
  try {
    const likedbyUserKiId = req.id;
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.updateOne({ $pull: { like: likedbyUserKiId } });
    await post.save();
    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addcomment = async (req, res) => {
  try {
    const text = req.body.text;
    const commentatorId = req.id;
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Create the comment first
    const comment = await Comment.create({
      comment: text,
      post: postId,
      author: commentatorId,
    });

    // Populate author field for the created comment
    const populatedComment = await Comment.populate(comment, { path: "author", select: "-password" });

    // Push the populated comment to the post
    post.comments.push(populatedComment._id);
    await post.save();
    
    return res.status(201).json({ message: "Comment added successfully", comment: populatedComment });
  } catch (error) {
    console.error("Error adding comment: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "-password"
    );
    if (!comments) {
      return res.status(404).json({ message: "No comments found" });
    }
    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error getting comments of post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    const AuthorId = req.id;
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== AuthorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    await post.findByIdAndDelete(postId);
    let user = await UserModel.findById(AuthorId);
    user.posts.pull(postId);
    await user.save();
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    let user = await UserModel.findById(authorId);
    const isBookmarked = user.bookmarks.includes(postId);
    if (isBookmarked) {
      user.bookmarks.pull(postId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Post unbookmarked successfully" });
    } else {
      user.bookmarks.push(postId);
      await user.save();
      return res.status(200).json({ message: "Post bookmarked successfully" });
    }
  } catch (error) {
    console.error("Error bookmarking post: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
