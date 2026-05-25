import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({

host:"smtp.gmail.com",

port:587,

secure:false,

auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS
},

tls:{
rejectUnauthorized:false
}

});

export const sendOTP = async(email,otp)=>{

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:email,

subject:"PathForge OTP Verification",

html:`

<h2>Welcome to PathForge 🚀</h2>

<p>Your verification code:</p>

<h1>${otp}</h1>

<p>Valid for 5 minutes.</p>

<p>If this wasn't you, simply ignore this email.</p>

`

});

};