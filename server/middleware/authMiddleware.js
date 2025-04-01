import jwt from 'jsonwebtoken';
import { Usermodel } from '../models/user.models.js';

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized! Token missing. Please log in again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the full user object using the decoded ID
        const user = await Usermodel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        req.user = user;

        
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Authentication failed. " + error.message
        });
    }
};
