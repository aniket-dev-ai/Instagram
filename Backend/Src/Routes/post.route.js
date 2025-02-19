const express = require("express");
const router = express.Router();
const auth = require("../MiddleWare/Auth");
const upload = require("../MiddleWare/Multer");
const {
  addNewPost,
  getAllPosts,
  getPost,
  UserPosts,
  LikePost,
  UnlikePost,
  addcomment,
  getCommentsOfPost,
  deletePost,
  bookMarkPost,
} = require("../Controller/post.controller");


router.post("/add", auth, upload.single("image"), addNewPost);
router.get("/all", auth, getAllPosts);
router.get("/UserPosts/all", auth, getPost);
router.get("/user/:id/posts", auth, UserPosts);
router.post("/:id/like", auth, LikePost);
router.post("/:id/unlike", auth, UnlikePost);
router.post("/:id/comment", auth, addcomment);
router.get("/:id/comment/all", auth, getCommentsOfPost);
router.delete("/delete/:id", auth, deletePost);
router.post("/:id/bookmark", auth, bookMarkPost);

module.exports = router;