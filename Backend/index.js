const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const userRoute = require("./Src/Routes/user.route");
const PostRoute = require("./Src/Routes/post.route");
const MessageRoute = require("./Src/Routes/message.route");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

require("./Src/Config/Db").connect();

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World", success: true });
});
const PORT = process.env.PORT || 5000;

app.use("/api/user", userRoute);
app.use("/api/post", PostRoute);
app.use("/api/message", MessageRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
