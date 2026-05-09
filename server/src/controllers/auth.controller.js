import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const handleSignup = async(req, res) => {
const{name,email,password} = req.body;
if(!name||!email||!password){
    return res.status(400).json({message:'All fields are required'});
}
if(!email.includes('@')){
    return res.status(400).json({message:'Invalid email'});
}
if(password.length<8){
    return res.status(400).json({message:'Password must be at least 8 characters long'});
}

const existingUser = await User.findOne({email});
if (existingUser){
  return res.status(400).json({ message: "User Already Exists" });
}
const hashedPassword = await bcrypt.hash(password,10);

const NewUser = await User.create({
name,
email,
password : hashedPassword,
});
return res.status(201).json({
  message: 'New user created successfully',
});
};

export const handleLogin = async (req, res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            message:'Invalid Credential',
        })
    }

    const refreshToken = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );
        
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
      );
      user.refreshToken = refreshToken;
      await user.save();

        return res.status(200).json({
            message:'User Logged In',
            refreshToken,
            accessToken,
        });
    

  };
  

   export const refreshAccessToken = async (req,res)=>{
    const {refreshToken} = req.body;
    if(!refreshToken){
      return res.status(401).json({
        message:'Invalid Token',
      });
    }
    try{
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.userId);
    if(!user || user.refreshToken!==refreshToken){
      return res.status(401).json({
        message:'invalid refresh token',
      });
    }
    const newAccessToken = jwt.sign(
      {
        userId : user._id,
      },
        process.env.JWT_SECRET,
      
      {
        expiresIn : '15m',
      }
    );
    return res.status(200).json({
      accessToken:newAccessToken,
    });

    
    }catch(error){
      return res.status(401).json({
        message:'Invalid or expired token',
      });
    }

   };






  export const getProfile = async(req, res) => {
    const user = await User.findById(req.user.userId);

    return res.status(200).json({
      name : user.name,
      email: user.email,
    });
  };

