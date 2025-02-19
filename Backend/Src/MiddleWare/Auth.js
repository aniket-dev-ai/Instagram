const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;

        next();
    } catch (error) {
        console.error("Error authenticating user: ", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = auth;
