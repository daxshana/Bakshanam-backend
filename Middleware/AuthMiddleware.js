// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }
    
//     console.log("Received token:", token); // Debug log

//     try {
//         const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         console.error("Token verification error:", err); // Debug log
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

// // Middleware to protect routes and check user roles
// const authMiddleware = (roles = []) => {
//     return (req, res, next) => {
//         const token = req.header('Authorization');
//         if (!token) {
//             return res.status(401).json({ message: 'No token, authorization denied' });
//         }

//         try {
//             const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
//             req.user = decoded.user; // Attach user info to request
//             // Check if the user's role is allowed
//             if (roles.length && !roles.includes(decoded.user.role)) {
//                 return res.status(403).json({ message: 'Access denied, insufficient permissions' });
//             }
//             next(); // Proceed to the next middleware or route handler
//         } catch (err) {
//             console.error("Token verification error:", err);
//             res.status(401).json({ message: 'Token is not valid' });
//         }
//     };
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

// // Middleware to protect routes and check user roles
// const authMiddleware = (roles = []) => {
//     return (req, res, next) => {
//         const authHeader = req.header('Authorization');
        
//         // Check if authorization header is present and starts with "Bearer"
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Authorization denied: No token provided' });
//         }
        
//         const token = authHeader.split(' ')[1]; // Extract the token part

//         try {
//             const decoded = jwt.verify(token, JWT_SECRET);
//             req.user = decoded.user; // Attach user info to the request

//             // Check if user and user role exist in the token payload
//             if (!req.user || !req.user.role) {
//                 return res.status(401).json({ message: 'Token is invalid: No user or role info' });
//             }

//             // Check if the user's role is allowed
//             if (roles.length && !roles.includes(req.user.role)) {
//                 return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
//             }

//             next(); // Proceed to the next middleware or route handler
//         } catch (err) {
//             console.error("Token verification error:", err.message);
//             res.status(401).json({ message: 'Token is not valid' });
//         }
//     };
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Please log in first.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded.user;

            // Check if user and user role exist in the token payload
            if (!req.user || !req.user.role) {
                return res.status(401).json({ message: 'Token is not valid: Role not found in token.' });
            }

            // Check if the user's role is allowed
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied, insufficient permissions' });
            }

            next();
        } catch (err) {
            console.error("Token verification error:", err.message);
            return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
        }
    };
};


module.exports = authMiddleware;



