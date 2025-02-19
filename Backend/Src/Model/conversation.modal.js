const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    massage:[{type:mongoose.Schema.Types.ObjectId, ref:"Message", default:[]}]
})

module.exports = mongoose.model("Conversation", conversationSchema);