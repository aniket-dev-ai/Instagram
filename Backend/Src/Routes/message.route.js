const express = require("express");
const router = express.Router();
const auth = require("../MiddleWare/Auth")
const upload = require("../MiddleWare/Multer");
const { sendMessages, getMessages } = require("../Controller/message.controller");

router.post("/send/:id", auth, sendMessages);
router.get("/get/:id", auth, getMessages);

module.exports = router;