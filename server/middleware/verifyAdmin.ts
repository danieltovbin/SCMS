import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAdmin = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken.roles.includes('admin')) {
            req.user = decodedToken;
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}