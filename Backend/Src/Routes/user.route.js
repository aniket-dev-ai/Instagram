const express = require("express");
const router = express.Router();
const upload = require("../MiddleWare/Multer");

const {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getsuggestedUsers,
  followorunfollow,
} = require("../controller/user.controller");
const  auth  = require("../MiddleWare/Auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/:id/profile", auth, getProfile);
router.post(
  "/profile/editProfile",
  auth,
  upload.single("profilepicture"),
  editProfile
);
router.get("/suggestedUsers", auth, getsuggestedUsers);
router.post("/followorunfollow", auth, followorunfollow);

module.exports = router;
