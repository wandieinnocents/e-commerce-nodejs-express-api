const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const authMiddlewareJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // token same as in login
            const user = await User.findById(decoded.id); // or logged in user 

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user; // Attach user to request
            // console.log('User found:', user);
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    } else {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
};

module.exports = authMiddlewareJWT;
