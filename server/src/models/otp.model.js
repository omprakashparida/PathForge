import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

email:{
type:String,
required:true
},

otp:{
type:String,
required:true
},

name:{
type:String,
required:true
},

password:{
type:String,
required:true
},

expiresAt:{
type:Date,
required:true
},

purpose:{

    type:String,
    
    default:"signup"
    
    },
// ==========================
// Resend attempts
// ==========================

resendCount:{
type:Number,
default:0
},

nextResendTime:{
type:Date,
default:Date.now
},

lockedUntil:{
type:Date,
default:null
}

},
{
timestamps:true
});

const OTP=mongoose.model(
"OTP",
otpSchema
);

export default OTP;