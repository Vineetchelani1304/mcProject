const bcrypt = require('bcrypt');
const User = require("../Models/User.Model");
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "Enter all the fields"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Please register first"
            });
        }
        console.log("user's hashed password", user.password);

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            const payload = {
                email: user.email, 
                id: user._id
            };
            console.log("payload",payload);
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3d"
            });

            

            user.token = token;
            user.password = undefined;  // Remove password from response

            console.log("user after login", user);

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Login Success",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure Please Try Again",
        });
    }
};
