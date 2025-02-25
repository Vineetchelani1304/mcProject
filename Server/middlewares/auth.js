const jwt = require('jsonwebtoken');
const User = require('../Models/User.Model');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        // Retrieve token from cookies, authorization header, or request body
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;
        console.log("token :",token)

        if (!token) {
            return res.status(403).json({
                success: false,
                message: "Token not found"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded :",decoded)
        req.user = decoded; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.log("error",error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong while validating the token',
            });
        }
    }
};
