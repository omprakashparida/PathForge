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
    return res.send("User Already Exists");
}
const hashedPassword = await bcrypt.hash(password,10);

const NewUser = await User.create({
name,
email,
password : hashedPassword,
});
res.send("New User Created Sucessfully!!!!")
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

    const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );
        return res.status(200).json({
            message:'User Logged In',
        });
    

  };

