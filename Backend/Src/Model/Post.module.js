const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: { type: String, max: 100, default: "" },
  image: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] },
  ],
});

module.exports = mongoose.model("Post", postSchema);
