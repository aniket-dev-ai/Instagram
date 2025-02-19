const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
senderId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
recieverId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
text:{type:String, required:true},
})

module.exports = mongoose.model("Message", messageSchema);