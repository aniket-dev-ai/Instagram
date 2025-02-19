const UserModel = require("../Model/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataUri = require("../utils/datauri");
const cloudinary = require("../Config/cloudinary");

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (await UserModel.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({ email, password: hashedPassword, username });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    user = {
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ message: "Logged in successfully", user , token:token });
  } catch (error) {
    console.error("Error logging in user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userid = req.params.id;
    let user = await UserModel.findById(userid).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user profile: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userid = req.id;
    const { username, email, bio, gender } = req.body;
    const profilePicture = req.file ? req.file.path : "";
    let cloudResponse = "";
    if (profilePicture) {
      const fileUri = dataUri(profilePicture);
      await cloudinary.uploader.upload(fileUri.content, (error, result) => {
        if (error) {
          console.error("Error uploading image: ", error);
          return res.status(500).json({ message: "Internal server error" });
        }
        cloudResponse = result.url;
      });
    }
    const user = await UserModel.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.bio = bio || user.bio;
    user.username = username || user.username;
    user.gender = gender || user.gender;

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" , user });
  } catch (error) {
    console.error("Error editing user profile: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getsuggestedUsers = async (req, res) => {
  try {
    const suggestedusers = await UserModel.find({
      _id: { $ne: req.id },
    }).selected("-password");
    if (!suggestedusers) {
      return res.status(404).json({ message: "No suggested users found" });
    }
    return res.status(200).json({ suggestedusers });
  } catch (error) {
    console.error("Error getting suggested users: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.followorunfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const followKiaGaya = req.params.id;
    if (followKrneWala === followKiaGaya) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }
    const user = await UserModel.findById(followKrneWala);
    const targetedUser = await UserModel.findById(followKiaGaya);
    if (!user || !targetedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = user.following.includes(followKiaGaya);
    if (isFollowing) {
      await Promise.all([
        UserModel.updateOne(
          { _id: followKrneWala },
          { $pull: { following: followKiaGaya } }
        ),
        UserModel.updateOne(
          { _id: followKiaGaya },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await Promise.all([
        UserModel.updateOne(
          { _id: followKrneWala },
          { $push: { following: followKiaGaya } }
        ),
        UserModel.updateOne(
          { _id: followKiaGaya },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error following/unfollowing user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
