import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";

const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User not found."})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({success:false,message:"Invalid credentials"})
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //save refresh token in database
        user.refreshToken = refreshToken;
        await user.save();
        
        //Store refresh token in httpOnly cookie
        //Never expose it in frontend JS
        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        });

        res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });
    }catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

const register = async (req,res) =>{
    try{
        const {name,email,password} = req.body;
        const isUserExist = await User.findOne({email});
        if(isUserExist){
            return res.status(400).json({success:false,message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            password:hashedPassword,
        });
        await user.save();
        res.status(201).json({success:true,message:"User registered successfully"});
    }
    catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

const refresh = async (req, res) => {
    try{
        const token = req.cookies.refreshToken;
        if(!token){
            return res.status(401).json({success:false,message:"No refresh token provided"})
        }

        let decoded;
        try{
            decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        }catch(err){
            return res.status(401).json({success:false,message:"Invalid or expired refresh token"})
        }

        const user = await User.findById(decoded.id);
        // Reject if the token doesn't match what's stored, e.g. it was already
        // rotated away or the user logged out - stops a stolen refresh token
        // from being replayed after that.
        if(!user || user.refreshToken !== token){
            return res.status(401).json({success:false,message:"Refresh token is no longer valid"})
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        });

        res.status(200).json({
        success: true,
        accessToken,
        });
    }catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

const logout = async (req, res) => {
    try{
        const token = req.cookies.refreshToken;
        if(token){
            try{
                const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
                // Only clear it if it still matches - avoids wiping out a
                // newer token if it was already rotated by a /refresh call
                // that landed just before this request.
                await User.updateOne(
                    {_id: decoded.id, refreshToken: token},
                    {refreshToken: null}
                );
            }catch(err){
                // token already invalid/expired - nothing to revoke in the DB
            }
        }

        res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        });

        res.status(200).json({success:true, message:"Logged out successfully"});
    }catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

export { login, register, refresh, logout};