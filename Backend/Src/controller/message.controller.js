const Conversation = require("../Model/conversation.modal");
const Message = require("../Model/message.modal")

exports.sendMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const message = req.body.message;

        let convo = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] },
        });

        if(!convo) {
            convo = await Conversation.create({
                participants: [senderId, recieverId],
            });
        }   
        const newMessage = await Message.create({
            senderId,
            text:message,
            recieverId
        })
        if(newMessage){
            Conversation.massage.push(newMessage._id);
        }

        await convo.save(); 
        await newMessage.save();

        return res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending messages: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


exports.getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const convo = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] },
        }).populate("messages");

        if(!convo) {
            return res.status(404).json({ message: "No messages found" });
        }

        return res.status(200).json({ messages: convo.messages });
    } catch (error) {
        console.error("Error getting messages: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}