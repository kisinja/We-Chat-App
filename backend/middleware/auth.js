import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) return res.status(403).json({ error: 'Access Denied' });
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.status(401).json({ error: 'Token verification failed, authorization denied.' });

        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};