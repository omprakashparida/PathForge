import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {

console.log(
"CURRENT ENV:",
process.env.NODE_ENV
);

try{

const isDevelopment =

process.env.NODE_ENV !== "production";


// ==========================================
// LOCAL → NODEMAILER
// ==========================================

if(isDevelopment){

console.log(
"🚀 Local Mode: Nodemailer"
);

const transporter = nodemailer.createTransport({

host:"smtp.gmail.com",

port:587,

secure:false,

auth:{

user:process.env.EMAIL_USER,

pass:process.env.EMAIL_PASS

}

});


const info = await transporter.sendMail({

from:`"PathForge" <${process.env.EMAIL_USER}>`,

to:email,

subject:"PathForge OTP Verification 🚀",

html:`

<div style="
font-family:Arial,sans-serif;
text-align:center;
padding:20px;
">

<h2>

Welcome to PathForge 🚀

</h2>

<p>

Your verification code:

</p>

<h1 style="
color:#2563eb;
letter-spacing:6px;
">

${otp}

</h1>

<p>

Valid for 5 minutes.

</p>

<p>

If this wasn't you, simply ignore this email.

</p>

</div>

`

});

console.log(
"Email Sent:",
info.messageId
);

return info;

}


// ==========================================
// PRODUCTION → BREVO
// ==========================================

console.log(
"🌐 Production Mode: Brevo"
);

const response = await fetch(

"https://api.brevo.com/v3/smtp/email",

{

method:"POST",

headers:{

Accept:"application/json",

"Content-Type":"application/json",

"api-key":process.env.BREVO_API_KEY

},

body:JSON.stringify({

sender:{

name:"PathForge",

email:process.env.BREVO_SENDER_EMAIL

},

to:[

{email}

],

subject:"PathForge OTP Verification 🚀",

htmlContent:`

<div style="
font-family:Arial,sans-serif;
max-width:500px;
margin:0 auto;
padding:20px;
border:1px solid #e2e8f0;
border-radius:12px;
">

<h2 style="
text-align:center;
">

Welcome to PathForge 🚀

</h2>

<p style="
text-align:center;
">

Your verification code:

</p>

<div style="
text-align:center;
margin:30px;
">

<span style="
font-size:36px;
font-weight:bold;
letter-spacing:6px;
color:#2563eb;
">

${otp}

</span>

</div>

<p style="
font-size:12px;
text-align:center;
">

This code expires in 5 minutes.

If this wasn't you, simply ignore this email.

</p>

</div>

`

})

}

);

const data = await response.json();

if(!response.ok){

console.log(
"BREVO ERROR:",
data
);

throw new Error(

data.message ||

"Failed sending email"

);

}

return data;

}
catch(error){

console.log(
"EMAIL ERROR:",
error
);

throw error;

}

};