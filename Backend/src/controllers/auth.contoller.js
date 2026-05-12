const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const rateLimit = require("express-rate-limit");

const limiter = 0;

async function registerUser(req,res){
    const {username,email,password,role="guest"} = req.body;

    const isUseralreadyExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isUseralreadyExist){
        return res.status(409).json({
            message: "User with Email or Username already exist!"
        })
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({
            message: "Invalid Email "
        })
    }

    if(!validator.isStrongPassword(password)){
        return res.status(400).json({
            message: "Use Strong Password!!"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hashedPassword,
        role,
    })
    const token = jwt.sign({
        id: user._id,
        role: user.role,
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)
    res.status(200).json({
        message: "User Registered!!",
        user:{
            id: user._id,
            username: user.username,
            email:user.email
        }
    })
}

async function loginUser(req,res){
    const {username,email, password} = req.body;
    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user)
        return res.status(410).json({
            message: "invalid Credential"
    })

    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
            return res.status(401).json({
                message: "Invalid xcredentials"
            })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    },process.env.JWT_SECRET,{expiresIn: "1d"})
        
    res.cookie("token",token)

    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

async function logoutUser(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message :"User looged Out succesfully"
    })
}
module.exports = {registerUser,loginUser,logoutUser}