const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    console.log("Received token:", token); // Debug log

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("Token verification error:", err); // Debug log
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
