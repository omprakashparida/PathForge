import bcrypt from "bcryptjs";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTP } from "../utils/sendEmail.js";


// Send OTP


export const sendSignupOTP = async(req,res)=>{

try{

const {name,email,password}=req.body;


// Check existing user

const existingUser=await User.findOne({
email
});

if(existingUser){

return res.status(400).json({

message:"User already exists"

});

}


// Generate OTP

const otp=generateOTP();


// Hash password before storing

const hashedPassword=await bcrypt.hash(
password,
10
);


// Delete previous OTP if any

await OTP.deleteMany({
email
});


// Save temporary data

await OTP.create({

name,
email,
password:hashedPassword,
otp,

expiresAt:new Date(
Date.now()+5*60*1000
)

});


// Send email

await sendOTP(
email,
otp
);

res.status(200).json({

message:"OTP sent successfully"

});

}

catch(error){

    console.log("OTP ERROR:", error);
    
    res.status(500).json({
    
    message:error.message
    
    });
    
    }

};


// Verify OTP

export const verifySignupOTP=async(req,res)=>{

try{

const {email,otp}=req.body;


const otpData=await OTP.findOne({
email
});

if(!otpData){

return res.status(400).json({

message:"OTP not found"

});

}


if(
new Date()>otpData.expiresAt
){

return res.status(400).json({

message:"OTP expired"

});

}


if(
otp!==otpData.otp
){

return res.status(400).json({

message:"Invalid OTP"

});

}


// Create actual user

await User.create({

name:otpData.name,

email:otpData.email,

password:otpData.password

});


// Remove temp OTP

await OTP.deleteMany({
email
});


res.status(200).json({

message:"Signup successful"

});

}
catch(error){

console.log(error);

res.status(500).json({

message:"Verification failed"

});

}

};

// Resend OTP


export const resendOTP=async(req,res)=>{

    try{
    
    const {email}=req.body;
    
    const otpData=await OTP.findOne({
    email
    });
    
    if(!otpData){
    
    return res.status(404).json({
    
    message:"Signup session not found"
    
    });
    
    }
    
    
    // Check lock
    
    if(
    
    otpData.lockedUntil &&
    
    new Date()<otpData.lockedUntil
    
    ){
    
    return res.status(400).json({
    
    message:
    
    `Too many attempts. Try after 30 minutes.`
    
    });
    
    }
    
    
    // Check cooldown
    
    if(
    
    new Date()<otpData.nextResendTime
    
    ){
    
    const seconds=Math.ceil(
    
    (otpData.nextResendTime-new Date())/1000
    
    );
    
    return res.status(400).json({
    
    message:`Wait ${seconds}s`
    
    });
    
    }
    
    
    // Generate OTP
    
    const otp=generateOTP();
    
    
    // Increase resend count
    
    const newCount=
    
    otpData.resendCount+1;
    
    
    // Lock after 5 attempts
    
    let lockedUntil=null;
    
    if(newCount>=5){
    
    lockedUntil=new Date(
    
    Date.now()+30*60*1000
    );
    
    }
    
    
    // Dynamic cooldown
    
    const cooldown=
    
    newCount*30;
    
    
    otpData.otp=otp;
    
    otpData.resendCount=newCount;
    
    otpData.nextResendTime=
    
    new Date(
    
    Date.now()+cooldown*1000
    );
    
    otpData.lockedUntil=
    
    lockedUntil;
    
    await otpData.save();
    
    await sendOTP(
    
    email,
    otp
    );
    
    res.json({
    
    message:"OTP resent successfully"
    
    });
    
    }
    catch(error){
    
    console.log(error);
    
    res.status(500).json({
    
    message:"Failed to resend OTP"
    
    });
    
    }
    
    };

    // ==========================
// Forgot Password Send OTP
// ==========================

export const sendForgotOTP=async(req,res)=>{

    try{
    
    const {email}=req.body;
    
    const user=await User.findOne({
    email
    });
    
    if(!user){
    
    return res.status(404).json({
    
    message:"User not found"
    
    });
    
    }
    
    const otp=generateOTP();
    
    await OTP.deleteMany({
    
    email,
    purpose:"forgotPassword"
    
    });
    
    
    await OTP.create({
    
    email,
    
    otp,
    
    name:user.name,
    
    password:user.password,
    
    purpose:"forgotPassword",
    
    expiresAt:new Date(
    Date.now()+5*60*1000
    )
    
    });
    
    await sendOTP(
    email,
    otp
    );
    
    res.json({
    
    message:"OTP sent"
    
    });
    
    }
    catch(error){
    
    console.log(error);
    
    res.status(500).json({
    
    message:"Failed sending OTP"
    
    });
    
    }
    
    };
    
    
    
    
    // ==========================
    // Verify Forgot OTP
    // ==========================
    
    export const verifyForgotOTP=async(req,res)=>{
    
    try{
    
    const {email,otp}=req.body;
    
    const otpData=await OTP.findOne({
    
    email,
    purpose:"forgotPassword"
    
    });
    
    
    if(!otpData){
    
    return res.status(404).json({
    
    message:"OTP not found"
    
    });
    
    }
    
    
    if(
    new Date()>otpData.expiresAt
    ){
    
    return res.status(400).json({
    
    message:"OTP expired"
    
    });
    
    }
    
    
    if(
    otp!==otpData.otp
    ){
    
    return res.status(400).json({
    
    message:"Invalid OTP"
    
    });
    
    }
    
    
    res.json({
    
    message:"OTP verified"
    
    });
    
    }
    catch(error){
    
    console.log(error);
    
    res.status(500).json({
    
    message:"Verification failed"
    
    });
    
    }
    
    };


    // ==========================
// Reset Password
// ==========================

export const resetPassword=async(req,res)=>{

    try{
    
    const {
    
    email,
    newPassword
    
    }=req.body;
    
    
    const hashedPassword=
    
    await bcrypt.hash(
    
    newPassword,
    10
    
    );
    
    
    await User.findOneAndUpdate(
    
    {email},
    
    {
    
    password:hashedPassword
    
    }
    
    );
    
    
    await OTP.deleteMany({
    
    email,
    purpose:"forgotPassword"
    
    });
    
    
    res.json({
    
    message:"Password updated successfully"
    
    });
    
    }
    catch(error){
    
    console.log(error);
    
    res.status(500).json({
    
    message:"Failed updating password"
    
    });
    
    }
    
    };