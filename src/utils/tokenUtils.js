import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>{
    return jwt.sign(
        {id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {
        expiresIn:"15m"
        }
    );
};

export const generateRefreshToken = (user)=>{
    return jwt.sign(
        {id:user._id},
        process.env.REFRESH_SECRET,
        {expiresIn:"7d"}
    );
};

// excluding role from the refresh token while including it in the 
// access token is standard best practice.

//Including role in the access token allows your middleware to check permissions 
// statelessly on every HTTP request without querying the database each time.

//If an admin demotes a user from "admin" to "viewer" on Day 1, 
// embedding role inside a 7-day refresh token would mean the token holds
// stale permissions.