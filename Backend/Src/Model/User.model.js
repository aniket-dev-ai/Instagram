const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, max: 100, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }],
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }],
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    }],
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: [],
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
