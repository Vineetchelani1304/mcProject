const User = require('../Models/User.Model')
const bcrypt = require('bcrypt')
exports.Signup = async (req,res) => {
    try {
        const { name, email, password, confirmPassword} = req.body;
        if(await User.findOne({email: email})){
            return res.status(400).json({
                success: false,
                message:"already registered"
            })
        }

        if(password !== confirmPassword){
            return res.status(403).json({
                success: false,
                message:"password and confirm password do not match"
            })
        }
        const encryptedPass = await bcrypt.hash(password,10);
        
        const NewUser = await User.create({
            name:name,email:email,password:encryptedPass
        });


        console.log("new user :-",NewUser)
        return(
            res.status(200).json({
            success: true,
            message:"user created successfully",
            data:NewUser
        }))

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error while creating user"
        })
    }
}